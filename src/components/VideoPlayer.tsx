import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';
import { Qualities, StreamFile } from '@movie-web/providers';

interface ProgressProps {
  value: number;
  onChangef: (value: number) => void;
}
interface VideoProps{
  videoSrc:string;
  Name:string;
  type: 'hls' | 'file';
  Quality: Record<Qualities, StreamFile> | null
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
const VideoPlayer: React.FC<VideoProps> = ({videoSrc , Name, type, Quality}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLink , setVideoLink] = useState(videoSrc);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadedFraction, setLoadedFraction] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  //ui close
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (type === 'hls' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoLink);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          videoRef.current?.play();
        });
      } else if (type === 'file') {
        videoRef.current.src = videoLink;
      }
    }
  }, [videoLink, type]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      if (!playing) {
        setShowUI(true);
        document.body.style.cursor = 'default';
      } else {
        setShowUI(true);
        document.body.style.cursor = 'default';
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setShowUI(false);
          document.body.style.cursor = 'none'; // Hide mouse when UI is hidden
        }, 3000); // Hide UI after 3 seconds of inactivity
      };
    };

    const handleMouseLeave = () => {
      if (!playing) {
        setShowUI(true);
        document.body.style.cursor = 'default';
      } else {
        setShowUI(false);
        document.body.style.cursor = 'none'; // Hide mouse when UI is hidden
      };
    };

    const handleMouseEnter = () => {
      if (!playing) {
        setShowUI(true);
        document.body.style.cursor = 'default';
      } else {
        setShowUI(true);
        document.body.style.cursor = 'default';
      };
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      clearTimeout(timeout); // Clear the timeout when the component unmounts
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [playing, showUI]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setDuration(videoElement.duration);
      if (playing) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  }, [playing]);

  const handleWaiting = () => {
    setIsLoading(true); // Set isLoading to true when video is waiting/buffering
  };

  const handleCanPlay = () => {
    setIsLoading(false); // Set isLoading to false when video can play
    const videoElement = videoRef.current;
    if (videoElement) setDuration(videoElement.duration);
  };


  const togglePlayback = () => {
    setPlaying(!playing);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    const videoElement = videoRef.current;
    if (videoElement) setDuration(videoElement.duration);
  };

  useEffect(() => {
    setProgress(calculateProgress(currentTime, duration));
  }, [currentTime, duration]);

  useEffect(() => {
    const videoElement = videoRef.current;
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
    const videoElement = videoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
    }
  };
  
  const addSeconds = (value : number) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = Math.round(value);
      setCurrentTime(videoElement.currentTime);
    }
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
      <h1 className='text-white text-2xl ml-12 mt-3'>{Name}</h1>
      <Link to='/Home' className="btn btn-ghost text-2xl absolute right-7 top-3 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text z-40">TUNISTREAM.CLUB</Link>

      </div>
    <div className="absolute inset-0 flex items-center justify-center">
    <div className='flex flex-col 'onClick={togglePlayback}>
      <video
        ref={videoRef}
        className={`${
          videoLoaded ? 'object-cover' : 'object-contain'
        } w-full h-full`}
        style={{ objectFit: 'contain', width: '100%', height: '100vh' }} // Make the video as big as the screen

        onPlay={()=> setPlaying(true)}
        onPause={()=> setPlaying(false)}
        autoPlay

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
        <div className={`absolute w-full h-fit bottom-2 pt-5 mt-10 rounded-lg transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
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


        <div className='flex flex-row absolute right-3'>

      <div className="dropdown dropdown-top dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost px-2 mx-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </div>
      <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 mb-5 shadow bg-base-200 text-content absolute right-0">
        <div className="card-body ">
          <h3 className="card-title">Quality:</h3>
          <table>
            <tbody>
              {Quality && Object.keys(Quality).map((quality, index) => (
                <tr key={index}>
                  <td>
                    <label className="cursor-pointer label">
                      <span className="label-text">{quality}</span>
                      <input type="radio" name="quality" className="radio" value={Quality[quality as Qualities].url} onChange={(e) => setVideoLink(e.target.value)} checked={videoLink === Quality[quality as Qualities].url} />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      <button className='btn btn-ghost px-2 mx-1 mr-3' onClick={handleFullscreenToggle}>
      {isFullscreen? <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>}
      </button>

      </div>



      </div>
        </div>
        </div>
    </>
  );
};

export default VideoPlayer;

