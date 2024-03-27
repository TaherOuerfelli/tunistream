import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ProgressProps {
  value: number;
  onChangef: (value: number) => void;
}
interface VideoProps{
  videoSrc:string;
  Name:string;
}

const HoverableProgress: React.FC<ProgressProps> = (props) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering?
      <input type="range" min={0} max="10000" value={props.value} className={`range range-xs range-accent absolute ml-7 bottom-[50px] transition-transform duration-1000 ${
        hovering ? 'h-4' : 'h-1'
      }`} style={{ width:'95%' }} onChange={(event) => props.onChangef(+(event.target.value))}/>
      : 
      <progress className="progress progress-accent absolute ml-7 bottom-14 h-1" style={{ width:'95%' }} value={props.value} max="10000"></progress>}
    </div>
  );
};

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const VideoPlayer: React.FC<VideoProps> = ({videoSrc , Name}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoElement = videoRef.current;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadedFraction, setLoadedFraction] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  //ui close
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      clearTimeout(timeout);
      setShowUI(true);
      timeout = setTimeout(() => {
        if(playing){
        setShowUI(false);}
      }, 5500); // Hide UI after 3 seconds of inactivity
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const from = event.relatedTarget as HTMLElement;
      if (!from || from.nodeName === 'HTML') {
        if(playing){
        setShowUI(false);}else{
          setShowUI(true);
        }
      }
    };

    const handleMouseEnter = () => {
      setShowUI(true);
      if (!showUI) {
        document.body.style.cursor = 'default'; // Reset cursor style when mouse enters
      }
    };

    // Set cursor to 'none' when showUI is false
    if (!showUI) {
      document.body.style.cursor = 'none';
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [showUI,playing]);

  useEffect(() => {
    // Reset cursor style when showUI becomes true
    if (showUI) {
      document.body.style.cursor = 'default';
    }
  }, [showUI]);



  useEffect(() => {
    

    // Load video metadata to get its aspect ratio

      if (videoElement) {
        setDuration(videoElement.duration);
        if (playing) {
          videoElement.play()
          

        }else
        {
          videoElement.pause()
        }
      }

  },[playing]);

  const handleWaiting = () => {
    setIsLoading(true); // Set isLoading to true when video is waiting/buffering
  };

  const handleCanPlay = () => {
    setIsLoading(false); // Set isLoading to false when video can play
    if (videoElement)setDuration(videoElement.duration);
  };



  const calculateHeight = () => {
    if (videoRef.current && videoLoaded) {
      const { videoWidth, videoHeight } = videoRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const videoAspectRatio = videoWidth / videoHeight;
      const screenAspectRatio = screenWidth / screenHeight;

      if (videoAspectRatio > screenAspectRatio) {
        return 'auto'; // Let the video adjust its height naturally
      } else {
        // Calculate the height required to maintain the aspect ratio
        return screenWidth / videoAspectRatio + 'px';
      }
    }
    return 'auto'; // Default to auto height if data is not loaded yet
  };


  const togglePlayback = () => {
    setPlaying(!playing);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    if (videoElement)setDuration(videoElement.duration);
  };



  useEffect(() => {
    setProgress(calculateProgress(currentTime, duration));
  }, [currentTime, duration]);


  useEffect(() => {


      if (videoElement) {
        const { buffered, duration } = videoElement;
        if (buffered.length > 0) {
          const bufferedEnd = buffered.end(buffered.length - 1);
          const fraction = bufferedEnd / duration;
          setLoadedFraction(fraction);
        }
      }


  }, [progress]);


  const calculateProgress = (currentTime: number, duration: number): number => {
    if (duration === 0) return 0; // To avoid division by zero

    const progress = (currentTime / duration) * 10000;
    return Math.min(progress, 10000); // Ensure the progress is within 0-10000
  };

  const handleProgress = (value:number) =>
  {
    console.log(value)
    addSeconds(duration * (value/10000))
  }

  const handleTimeUpdate = () => {
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
    }
  };
  
  const addSeconds = (value : number) => {
    if (videoElement)videoElement.currentTime = Math.round(value);
    if (videoElement)setCurrentTime(videoElement.currentTime);
  }


  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      // If the page is not in fullscreen mode, request fullscreen
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((error) => {
        console.error('Failed to enter fullscreen mode:', error);
      });
    } else {
      // If the page is already in fullscreen mode, exit fullscreen
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((error) => {
        console.error('Failed to exit fullscreen mode:', error);
      });
    }
  };
  return (
    <>
    <div className="relative h-screen">
      <div className={`flex flex-row relative top-5 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className='text-white text-xl ml-10 mt-1'>{Name}</h1>
      <Link to='/Home' className="btn btn-ghost text-2xl absolute right-5 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text z-40">TUNISTREAM.CLUB</Link>

      </div>
    <div className="absolute inset-0 flex items-center justify-center">
    <div className='flex flex-col 'onClick={togglePlayback}>
      <video
        ref={videoRef}
        src={videoSrc}
        className={`${
          videoLoaded ? 'object-cover' : 'object-contain'
        } w-full h-full`}
        style={{ height: calculateHeight() }}

        onPlay={()=> setPlaying(true)}
        onPause={()=> setPlaying(false)}
        autoPlay={true}

        onLoadedMetadata={handleVideoLoad}

        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}

        onTimeUpdate={handleTimeUpdate}

        >
          

          </video>
        {videoLoaded ? null : (
          <p>Loading video...</p>
      
          )}
        {isLoading &&
        <div className="absolute top-1/2 left-1/2">
          
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        }
        
        </div></div>
        <div className={`absolute w-full h-fit bottom-2 pt-5 mt-10 rounded-lg bg-base-100 bg-opacity-20 transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
        <progress className="progress absolute ml-8 bottom-14 h-1" style={{ width:'94%' }} value={Math.round(loadedFraction * 100)} max="100"></progress>
        <HoverableProgress value={progress} onChangef={handleProgress} />
        <div className='flex flex-row items-center mb-1'>
        <button className='btn btn-ghost ml-7 px-2' onClick={togglePlayback}>
        {playing ? 
       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
       : (
         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
         )}</button>

      <button className='btn btn-ghost px-2 mx-1' onClick={() => addSeconds(currentTime-10)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
      </button>
      <button className='btn btn-ghost px-2 mx-1 mr-5' onClick={() => addSeconds(currentTime+10)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
      </button>
      <h2 className=' text-xl'>{formatTime(currentTime)} / {formatTime(duration)}</h2>
      <button className='btn btn-ghost absolute px-2 mx-1 mr-5 right-3' onClick={handleFullscreenToggle}>
      {isFullscreen? <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>}
      </button>
      
      </div>
        </div>
        </div>
    </>
  );
};

export default VideoPlayer;