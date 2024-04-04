import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';
import { Qualities, StreamFile } from '@movie-web/providers';
import { ErrorBoundary } from '../pages/ErrorBoundary';
import { debounce } from 'lodash';




interface ProgressProps {
  value: number;
  onChangef: (value: number) => void;
}
interface VideoProps{
  videoSrc:string;
  Name:string;
  mediaID:string;
  mediaType:string;
  sessionIndex:string;
  episodeIndex:string;
  type: 'hls' | 'file';
  Quality: Record<Qualities, StreamFile> | null
}
type StreamHLS = {
  type: 'hls';
  url: string;
}
const HoverableProgress: React.FC<ProgressProps> = (props) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering?
      <input type="range" min={0} max="10000" value={props.value? props.value:0} className={`range range-xs range-accent absolute ml-7 bottom-[50px] transition-transform duration-1000 ${
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
  if(isNaN(time)) {return "00:00:00"}
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  
};

const VideoPlayer: React.FC<VideoProps> = ({videoSrc , Name, type, Quality , mediaID , mediaType , sessionIndex , episodeIndex}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const [videoLink , setVideoLink] = useState(videoSrc);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadedFraction, setLoadedFraction] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [AudioState, setAudioState] = useState('on');
  const [isAudioHovered, setAudioIsHovered] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState(0);
  const [settings, setSettings] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [theme , setTheme] = useState('dark');
  const [VideoQuality, setVideoQuality] = useState<Record<Qualities, StreamFile | StreamHLS> |null>(Quality);
  const [hlsMainLink, setHlsMainLink] = useState<string |null>(null);


  useEffect(()=>{
    let theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme || 'dark');
    setTheme(theme ?? 'dark');
    changeRangeValue();
  },[])

  useEffect(() => {
    if (videoRef.current) {
      setVideoLoaded(false);
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
      
      console.log(VideoQuality)
    }
  }, [videoLink, type]);

  useEffect(() => {
    if (videoRef.current) {
      if (type === 'hls' && Hls.isSupported()){
        setHlsMainLink(videoLink)
        const hls = new Hls();
        hls.loadSource(videoLink);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          const hlsQualitiesData = hls.levels.reduce((acc, level) => {
            const quality: Qualities = `${level.height}p`as Qualities;
            acc[quality] = {type: 'hls', url: level.url[0]};
            return acc;
          }, {} as Record<Qualities, StreamHLS>);
          setVideoQuality(hlsQualitiesData);
          
        });
        
      } 
    }
  },[videoSrc]);

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
    if (videoElement){
      changeRangeValue();
      setDuration(videoElement.duration);
      const storedMediaData = localStorage.getItem('mediaData');
        if (storedMediaData) {
          let mediaData = JSON.parse(storedMediaData);
          console.log("mediaDATA:",mediaData);
          if (mediaData) {
            let currentTime = 0;
          if(mediaType === "movie"){
           currentTime = mediaData['m'+mediaID];
          }else{
            currentTime = mediaData['s'+mediaID+sessionIndex+episodeIndex]
          }
          // Use the retrieved currentTime as needed
          addSeconds(currentTime);
      }}
    };
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
    if (videoElement && videoElement.readyState > 1 && !videoElement.paused) {
      setCurrentTime(videoElement.currentTime);
      let mediaData :  { [key: string]: number }  = {};
      try {
        const storedMediaData = localStorage.getItem('mediaData');
        if (storedMediaData) {
          mediaData = JSON.parse(storedMediaData);
        }
      } catch (error) {
        console.error('Error parsing media data from localStorage:', error);
      }
      if(mediaType === 'movie'){
        mediaData['m'+mediaID] = videoElement.currentTime;
      }else{
        mediaData['s'+mediaID+sessionIndex+episodeIndex] = videoElement.currentTime;
      }
      localStorage.setItem('mediaData', JSON.stringify(mediaData));
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
  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setError('An error occurred while playing the video. (Try changing source)');
    console.error('Video error:', (event.target as HTMLVideoElement).error);
  };

  const debouncedVolumeChange = debounce((value: number) => {
    if (videoRef.current) {
      if(value != 0){
      videoRef.current.volume = value / 100;
      videoRef.current.muted = false;
      if(videoRef.current.volume > 0.4){
        setAudioState('on')
      }else{
        setAudioState('low')
      }
    }else{
      videoRef.current.muted = true;
      setAudioState('off');
    }
    }
  }, 100); // Adjust the debounce delay as needed

  const changeRangeValue = () => {
    if (rangeRef.current && videoRef.current) {
      rangeRef.current.value = (videoRef.current.volume*100).toString();
    }
  };

const handleAudioButton = ()=>{
  if (videoRef.current) {
    if(videoRef.current.muted){
      videoRef.current.muted = false;
      setAudioState("on");
      changeRangeValue();

    }else{
      videoRef.current.muted = true;
      setAudioState("off");
      changeRangeValue();

    }
  }
};
useEffect(()=>{changeRangeValue();},[isAudioHovered]);
const handleSettings = ()=>{
  if(settings === false)setSettingsMenu(0);
  setSettings(!settings);
}

  return (
    <>
    <div className="relative h-screen overflow-hidden">
      <div className={`flex flex-row relative top-5 transition-all duration-500 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} z-50`}>
      <h1 className='text-white text-xl ml-12 mt-3'>{Name} {mediaType === "movie" ? null: <span className='text-gray-400 font-thin'>S{sessionIndex}:E{episodeIndex}</span>}</h1>
      <Link to='/Home' className="btn btn-ghost text-2xl absolute right-7 top-3 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text z-50" onClick={() => document.exitFullscreen()}>TUNISTREAM.CLUB</Link>

      </div>
    <div className="absolute inset-0 flex items-center justify-center">
    <div className='flex flex-col 'onClick={togglePlayback}>
      <ErrorBoundary>
      {error && <div className='flex flex-col justify-center items-center gap-4 absolute inset-0'>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Error: {error}</div>}
      <video
        ref={videoRef}
        className={`z-0 ${
          videoLoaded ? 'object-cover' : 'object-contain'
        } w-full h-full`}
        style={{ objectFit: 'contain', width: '100%', height: '100vh' }} // Make the video as big as the screen

        onPlay={()=> setPlaying(true)}
        onPause={()=> setPlaying(false)}
        onError={handleVideoError}
        autoPlay

        onLoadedMetadata={handleVideoLoad}
        
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}

        onTimeUpdate={handleTimeUpdate}

        >
          

          </video></ErrorBoundary>
        {/*videoLoaded ? null : (
          <p>Loading video...</p>
        )*/}
        {(isLoading || !videoLoaded) && !error &&
        <div className="flex justify-center items-center absolute inset-0">
          
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        }
        
        </div></div>

        {/* Settings tab ###############  */}
        {settings&&<div className='absolute top-0 w-screen h-screen bg-transparent z-[51]' onClick={() => setSettings(false)}></div>}
        <div className={`z-[55] overflow-hidden bg-base-200 rounded-sm p-2 px-2 mb-2 shadow text-content absolute right-5 bottom-16 transition-all  ease-in-out ${settings && showUI ? 'duration-100 opacity-100 translate-y-0 ' : 'duration-200 opacity-0 translate-y-10'}`}>
        {/* Settings Menu 0 */}
        <div role='Settings-menu'  className={`transition-all  ease-in-out ${settingsMenu===0 ? 'duration-100 opacity-100 translate-x-0 h-fit w-fit' : 'duration-100 opacity-0 -translate-x-32 w-0 h-0'}`}>
          <h3 className="card-title text-sm">Settings:</h3>
          <div className='divider h-0 m-0 my-2 w-full'></div>
          <button className="btn btn-ghost text-lg font-bold" onClick={() => setSettingsMenu(1)}><div className='flex flex-row justify-between'><span className='mr-10'>Quality: </span><span className='flex font-bold ml-5 p-0 text-sm px-3 rounded-box bg-base-content text-base-200 justify-center items-center'>{VideoQuality && Object.keys(VideoQuality).map((quality) => (videoLink === VideoQuality[quality as Qualities].url ? quality + (+quality ? 'p' : '') : ''))}</span></div></button>
        </div>
          {/* Settings Menu 1 */}
          <div role='Setting-option' className={`transition-all  ease-in-out ${settingsMenu===1 ? 'duration-250 opacity-100 translate-x-0 h-fit w-fit' : 'duration-300 opacity-0  translate-x-32 w-0 h-0'}`}>
          <div className='flex flex-row'> 
          <button className='btn btn-link p-0 my-0 mr-1' onClick={() =>setSettingsMenu(0)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" className='mr-2' viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M75 12H6M12 5l-7 7 7 7"/></svg>
          </button>
              <h3 className="card-title text-sm">Quality:</h3>
              </div>
                <div className='divider h-0 m-0 w-full'></div>
                <table>
                  <tbody>
                    {VideoQuality && Object.keys(VideoQuality).reverse().map((quality, index) => (
                      <tr key={index}>
                        <td>
                          <label className="cursor-pointer label">
                            <span className="label-text text-lg font-normal text-end mr-24">{quality}{+quality? 'p':''}</span>
                            <input type="radio" name="quality" className="radio" value={VideoQuality[quality as Qualities].url} onChange={(e) => setVideoLink(e.target.value)} checked={videoLink === VideoQuality[quality as Qualities].url} />
                          </label>
                        </td>
                      </tr>
                    ))}
                    {hlsMainLink && 
                    <label className="cursor-pointer label">
                    <span className="label-text text-1xl">Auto</span>
                    <input type="radio" name="quality" className="radio" value={hlsMainLink} onChange={(e) => setVideoLink(e.target.value)} checked={videoLink === hlsMainLink} />
                      </label>}
                  </tbody>
                </table>
           </div>
        </div>


        <div className={`absolute ${theme === 'light' || theme === 'cyberpunk' ? 'bg-base-200 bg-opacity-75' : ''} w-full h-fit bottom-0 pt-5 mt-10 rounded-lg transition-all duration-200 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} z-50`}>
        <progress className="progress absolute ml-7 bottom-14 h-1" style={{ width:'95%' }} value={Math.round(loadedFraction * 100)} max="100"></progress>
        <HoverableProgress value={progress} onChangef={handleProgress} />
        <div className='flex flex-row items-center mb-1'>
        <button className='btn btn-ghost ml-7 px-2' onClick={togglePlayback}>
        {playing ? 
       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
       : (
         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
         )}</button>

      <button className='btn btn-ghost px-3 ' onClick={() => addSeconds(currentTime-10)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
      </button>
      <button className='btn btn-ghost px-3 ' onClick={() => addSeconds(currentTime+10)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
      </button>


      <div className='flex flex-row h-full w-fit '>
        <button className=' w-fit px-1 btn btn-link no-underline no-animation' 
                onMouseEnter={() => setAudioIsHovered(true)}
                onMouseLeave={() => setAudioIsHovered(false)}
                >
                <div onClick={handleAudioButton} className='btn btn-ghost px-1'>
          {AudioState === 'on'? 
          
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
       : AudioState === 'low'?
       <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
       : AudioState === 'off'?
       <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/></svg>
       : null}</div>
          {isAudioHovered && (
      <input 
      ref={rangeRef}
      type="range" 
      min={0} 
      max={100}  
      onChange={(e) => {
        const volumeValue = parseFloat(e.target.value);
        debouncedVolumeChange(volumeValue);
      }} 
      className={`range range-xs w-24 mx-1 mr-3 transition-all duration-1000 ${
        isAudioHovered || isAudioHovered ? "opacity-100 translate-x-1" : "opacity-0"
      }`}
      />) }
      </button>

      </div>


      <h2 className='text-xl text-gray-300 ml-3'>{formatTime(currentTime)} / {formatTime(duration)}</h2>


        <div className='flex flex-row absolute right-3'>


      <button className="btn btn-ghost px-2 mx-1" onClick={handleSettings}>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </button>

      <button className='btn btn-ghost px-2 mx-1 mr-3' onClick={handleFullscreenToggle}>
      {isFullscreen? <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>}
      </button>

      </div>



      </div>
        </div>
        </div>
    </>
  );
};

export default VideoPlayer;


