import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';
import { EmbedOutput, Qualities, ScrapeMedia, StreamFile, makeProviders, makeSimpleProxyFetcher, makeStandardFetcher, targets } from '@movie-web/providers';
import { ErrorBoundary } from '../pages/ErrorBoundary';
import { debounce } from 'lodash';
import { SourcererOutput, NotFoundError } from '@movie-web/providers';
import RangeSlider from './RangeSlider';
import '../styles/videoplayer.css';

const proxyUrl = import.meta.env.VITE_PROXY_URL_LINK;

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl?proxyUrl:'', fetch),
  target: targets.BROWSER,
})

declare type SourcererEmbed = {
  embedId: string;
  url: string;
};

interface VideoProps{
  media:ScrapeMedia;
  videoSrc:string;
  provider_ID:string;
  providersList:string[];
  Name:string;
  mediaID:string;
  mediaType:string;
  sessionIndex:string;
  episodeIndex:string;
  Stream_Type: 'hls' | 'file';
  Quality: Record<Qualities, StreamFile> | null
}
type StreamHLS = {
  type: 'hls';
  url: string;
}
declare type EmbedId = {
  source: string;
  index: number | null;
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

const VideoPlayer: React.FC<VideoProps> = ({media, videoSrc, provider_ID, providersList , Name, Stream_Type, Quality , mediaID , mediaType , sessionIndex , episodeIndex}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [providerID , setCurrentProviderID] = useState(provider_ID);
  const [lastproviderID , setLastProviderID] = useState(provider_ID);
  const [videoLink , setVideoLink] = useState(videoSrc);
  const [type , setVideoType] = useState<'hls' | 'file'>(Stream_Type);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [error, setError] = useState<string>();
  const [fetchError, setFetchError] = useState<string>('');
  const [fetchEmbeds, setFetchEmbeds] = useState<SourcererEmbed[]>([]);
  const [LoadingEmbed, setLoadingEmbed] = useState<number | null>(null);
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
//  const [theme , setTheme] = useState('dark');
  const [VideoQuality, setVideoQuality] = useState<Record<Qualities, StreamFile | StreamHLS> |null>(Quality);
  const [hlsMainLink, setHlsMainLink] = useState(videoSrc);
  const [currentFetchSource, setCurrentFetchSource] = useState<string>('');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [erroredEmbed, setErroredEmbed] = useState<EmbedId | null>(null);
  const [currentEmbed, setCurrentEmbed] = useState<EmbedId | null>(null);

  // Function to handle window resize
  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    // Add event listener when component mounts
    window.addEventListener('resize', handleResize);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  
  useEffect(()=>{
    let theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme || 'dark');
    //setTheme(theme ?? 'dark');
    changeRangeValue();
  },[])

  useEffect(() => {
    if (videoRef.current) {
      setVideoLoaded(false);
      if (type === 'hls' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoLink);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            // Set errorOccurred state to true if error is fatal
            setError('An error occurred while playing the video. (Try changing source)');
          }
        });
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
        // Listen for errors
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            // Set errorOccurred state to true if error is fatal
            setError('An error occurred while playing the video. (Try changing source)');
          }
        });
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
  },[hlsMainLink]);


  const handleRefetch = async (id:string)=>{
    setFetchError('');
    setFetchEmbeds([]);
    setLastProviderID(id);
    // scrape a stream from source with id
    let output: SourcererOutput;
    try {
      output = await providers.runSourceScraper({
        id: id,
        media: media,
      })
    } catch (err) {
      if (err instanceof NotFoundError) {
        setFetchError('source does not have this media');
      } else {
        setFetchError('failed to scrape');
      }
      return;
    }

    if (!output.stream && output.embeds.length === 0) {
      setFetchError('no streams found');
    }else{

      if(output.embeds)setFetchEmbeds(output.embeds);
    }
  }

  const handleFetchEmbed = async (id:string , url:string , sourceID : string , EmbedIndex : number) => {
          // scrape a stream from upcloud
      let output: EmbedOutput;
      setErroredEmbed(null);
      try {
        output = await providers.runEmbedScraper({
          id: id,
          url: url,
        })
      } catch (err) {
        setErroredEmbed({source:sourceID , index:EmbedIndex })
        return;
      }

      // output.stream now has your stream
      const { stream } = output;
      const streamObj = stream[0];
      console.log('Embed Stream:',streamObj);
      if (streamObj.type === 'file') {
        const qualityEntries = Object.keys(streamObj.qualities);
        const streamQualities: Partial<Record<Qualities, StreamFile>> = streamObj.qualities;
        const firstQuality = qualityEntries[2]?qualityEntries[2]:qualityEntries[1]?qualityEntries[1]:qualityEntries[0];
        console.log(firstQuality);
        const firstStream = streamQualities[firstQuality as Qualities];
        console.log(firstStream);

        if (firstStream && firstStream.url) {
          (streamObj.type as "hls" | "file");
          setCurrentProviderID(lastproviderID);
          setVideoType('file');
          setVideoLink(firstStream.url);
          setVideoQuality(streamQualities as Record<Qualities, StreamFile>);

        }
      } else { // Assuming the only other type is 'hls'
        setCurrentProviderID(lastproviderID);
        setVideoType('hls');
        setVideoLink(streamObj.playlist);

      }
      setLoadingEmbed(null);
      setCurrentEmbed({source:sourceID,index:EmbedIndex})
      setSettings(false);
      setError(undefined);
  }

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

  const toggleFullScreen = () => {
    const fullscreenElement = fullscreenRef.current;
    if (!fullscreenElement) return;

    if (!document.fullscreenElement) {
        // If the page is not in fullscreen mode, request fullscreen
        fullscreenElement.requestFullscreen().then(() => {
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
    <div ref={fullscreenRef} className={`relative overflow-hidden`} style={{ height: windowDimensions.height, width: windowDimensions.width,maxHeight:windowDimensions.height, overflow: 'hidden'  }}>
    <div className="absolute inset-0 w-full flex items-center justify-center">
    <div className='flex flex-col 'onClick={togglePlayback}>
      <ErrorBoundary>
      {error && <div className='flex flex-col justify-center items-center gap-4 absolute inset-0'>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Error: {error}</div>}
      <video
        ref={videoRef}
        className={`z-0 ${
          videoLoaded ? 'object-cover' : 'object-contain'
        }`}
        style={{ objectFit: 'contain', width: window.innerWidth, height:  window.innerHeight }} // Make the video as big as the screen

        onPlay={()=> setPlaying(true)}
        onPause={()=> setPlaying(false)}
        onError={handleVideoError}
        autoPlay

        onLoadedMetadata={handleVideoLoad}
        
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}

        onTimeUpdate={handleTimeUpdate}
        onMouseEnter={() => setShowUI(true)}
        
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

{/* UI STARTS HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERE  */}
      <div className={`flex flex-row absolute top-5 transition-all duration-500 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} z-50`}>
      <h1 className='text-white opacity-65 sm:opacity-80 text-xl ml-5 sm:ml-12 sm:mt-3 mt-20'>{Name} {mediaType === "movie" ? null: <span className='text-gray-400 font-thin'>S{sessionIndex}:E{episodeIndex}</span>}</h1>
      </div>
      
      <div className={`flex flex-row absolute top-5 right-0 transition-all duration-500 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} z-50`}>
      <Link to='/Home' className="btn btn-ghost hidden sm:block text-lg sm:text-2xl absolute right-2 sm:right-10 top-2 sm:top-3 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text z-50" onClick={() => document.exitFullscreen()}>TUNISTREAM.CLUB</Link>
      </div>

        {/* Settings tab ###############  */}
        {settings&&<div className='absolute top-0 w-full bg-transparent z-[51]' style={{ height: window.innerHeight}} onClick={() => setSettings(false)}></div>}
        <div className={`z-[55] overflow-clip bg-base-200 rounded-box border-2 border-white/50 p-4 mb-2 shadow text-content absolute right-5 bottom-20 transition-all  ease-in-out ${settings && showUI ? 'duration-100 pointer-events-auto opacity-100 translate-y-0 ' : 'duration-200 pointer-events-none opacity-0 translate-y-10'}`}>
        {/* Settings Menu 0 */}
        <div role='Settings-menu'  className={`flex flex-col transition-all  ease-in-out ${settingsMenu===0 ? 'duration-100 opacity-100 translate-x-0 h-fit w-fit' : 'duration-100 opacity-0 -translate-x-32 w-0 h-0'}`}>
            
          <h3 className="card-title text-sm">Settings:</h3>
          <div className='divider h-0 m-0 my-2 w-full'></div>
          <table>
              <tbody>
                <tr>
                <button className="btn btn-ghost label text-lg w-full font-bold" onClick={() => setSettingsMenu(1)}><td><span className='mr-10'>Quality: </span></td><td><span className='flex font-bold p-0 text-sm px-3 rounded-box bg-base-content text-base-200 justify-center items-center'>{VideoQuality && Object.keys(VideoQuality).map((quality) => (videoLink === VideoQuality[quality as Qualities].url ? quality + (+quality ? 'p' : '') : ''))}{hlsMainLink && videoLink === hlsMainLink ? 'Auto': ''}</span></td></button>
                </tr>
                <tr>
                <button className="btn btn-ghost label text-lg w-full font-bold" onClick={() => setSettingsMenu(2)}><td><span className='mr-10'>Source: </span></td><td><span className='flex  justify-center items-center text-sm px-2'>{providerID}</span></td></button>
                </tr>
            </tbody>
          </table>
        </div>
        {/* Menu 0 End */}
          {/* Setting Menu 1 */}
          <div role='Setting-option' className={`transition-all  ease-in-out ${settingsMenu===1 ? 'duration-250 opacity-100 translate-x-0 h-fit w-fit' : 'duration-300 opacity-0  translate-x-32 w-0 h-0'}`}>
          <div className='flex flex-row'> 
          <button className='btn btn-link p-0 my-0 mr-1' onClick={() =>setSettingsMenu(0)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" className='mr-2' viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M75 12H6M12 5l-7 7 7 7"/></svg>
          </button>
              <h3 className="card-title text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              Quality</h3>
              </div>
                <div className='divider h-0 m-0 my-2 w-full'></div>
                <table>
                  <tbody>
                    {VideoQuality && Object.keys(VideoQuality).reverse().map((quality, index) => (
                      <tr key={index}>
                        <td>
                          <label className="cursor-pointer label">
                            <span className="label-text text-lg font-bold mr-24">{quality}{+quality? 'p':''}</span>
                            <input type="radio" name="quality" className="radio" value={VideoQuality[quality as Qualities].url} onChange={(e) => setVideoLink(e.target.value)} checked={videoLink === VideoQuality[quality as Qualities].url} />
                          </label>
                        </td>
                      </tr>
                    ))}
                    {hlsMainLink && 
                    <label className="cursor-pointer label">
                    <span className="label-text font-bold text-lg mr-24">Auto</span>
                    <input type="radio" name="quality" className="radio" value={hlsMainLink} onChange={(e) => setVideoLink(e.target.value)} checked={videoLink === hlsMainLink} />
                      </label>}
                  </tbody>
                </table>
           </div>
           {/* menu 1 END */}
           {/* Setting Menu 2 start */}
           <div role='Setting-option' className={`transition-all ease-in-out ${settingsMenu===2 ? 'duration-250 opacity-100 translate-x-0 h-fit w-fit' : 'duration-300 opacity-0  translate-x-32 w-0 h-0'}`}>
          <div className='flex flex-row'> 
          <button className='btn btn-link p-1 my-0 mr-1' onClick={() =>setSettingsMenu(0)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" className='mr-2' viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M75 12H6M12 5l-7 7 7 7"/></svg>
          </button>
              <h3 className="card-title text-sm ">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
              Sources</h3>
              </div>
                <div className='divider h-0 m-0 my-2 w-full'></div>
                <div className='h-auto scroll-smooth overflow-hidden overflow-y-auto'>
                <table>
                  <tbody>
                    {providersList && (providersList).map((Source, index) => (
                      <tr key={index}>
                        <td>
                          <button className="btn w-full label" onClick={() =>{setSettingsMenu(3); handleRefetch(Source);setLoadingEmbed(null);setCurrentFetchSource(Source);}}>
                            <span className="label-text text-lg font-bold mr-16">{Source}</span>
                            <span>{Source === providerID? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#4ee54d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            :''}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
           </div>
           {/* menu 2 END */}
           {/* Setting Menu 3 */}
        <div role='Settings-menu'  className={`flex flex-col  transition-all  ease-in-out ${settingsMenu===3 ? 'duration-100 opacity-100 translate-x-0 h-fit w-fit' : 'duration-100 opacity-0 -translate-x-32 w-0 h-0'}`}>
        <div className='flex flex-row'>
        <button className='btn btn-link p-1 my-0 mr-1' onClick={() =>setSettingsMenu(2)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" className='mr-2' viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M75 12H6M12 5l-7 7 7 7"/></svg>
          </button>
            <h3 className="card-title text-sm">Embeds:</h3></div>
            <div className='divider h-0 m-0 my-2 w-full'></div>
            <div className='flex w-[250px] h-[300px] overflow-y-auto justify-start items-start'>

              {fetchError ? <div className='flex flex-col p-10 w-full justify-center items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff4242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                <p className='text-gray-300 italic'>{fetchError}.</p></div>

                : 
                !fetchEmbeds || !(fetchEmbeds.length > 0) ? <div className='flex flex-col w-full  p-10 justify-center items-center gap-2'>
                    <span className="loading loading-spinner loading-md"></span><p>Fetching...</p>
                  </div> 
                  :
                  <div className='flex w-full  h-auto p-0 justify-start items-start scroll-smooth overflow-hidden overflow-y-auto'>
                <table>
                  <tbody>
                    {fetchEmbeds && (fetchEmbeds as SourcererEmbed[]).map((Embed, index) => (
                      <tr key={index}>
                        <td>
                          <button className={`btn ${LoadingEmbed === index ? 'btn-disabled':null} w-full label`} onClick={()=> {handleFetchEmbed(Embed.embedId,Embed.url,currentFetchSource,index); setLoadingEmbed(index)}}>
                            <span className="label-text  text-lg font-bold mr-10">{Embed.embedId}</span>
                            {LoadingEmbed === index && !erroredEmbed ? <span className="loading loading-spinner loading-md"></span>:erroredEmbed?.source === currentFetchSource && erroredEmbed?.index === index ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            :currentEmbed?.source === currentFetchSource && currentEmbed.index === index ? 'Selected':''}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div> 
                  
              }
            </div>
          </div>
          {/* Menu 3 End */}
        </div>


        <div className={`absolute w-full h-fit bottom-0 pt-5 rounded-lg transition-all duration-200 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} z-50`}>
   
        <RangeSlider Value={videoLoaded ? progress : 0} BufferValue={Math.round(loadedFraction * 10000)} onChange={(value) => handleProgress(value)}/>

        <div className='flex flex-row items-center mb-2 mt-3'>
        <button className='btn btn-ghost ml-7 px-2' onClick={togglePlayback}>
        {playing ? 
       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
       : (
         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
         )}</button>

      <button className='hidden sm:block btn btn-ghost px-3 ' onClick={() => addSeconds(currentTime-10)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
      </button>
      <button className='hidden sm:block btn btn-ghost px-3 ' onClick={() => addSeconds(currentTime+10)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
      </button>


      <div className='hidden sm:flex flex-row  h-full w-fit '>
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
      className={`range range-xs h-[7px] w-24 mx-1 mr-3 transition-all duration-1000 ${
        isAudioHovered || isAudioHovered ? "opacity-100 translate-x-1" : "opacity-0"
      }`}
      />) }
      </button>

      </div>


      <h2 className='text-sm sm:text-xl text-gray-300 ml-3'>{formatTime(currentTime)} / {formatTime(duration)}</h2>


        <div className='flex flex-row absolute right-3'>


      <button className="btn btn-ghost px-2 mx-1" onClick={handleSettings}>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </button>

      <button className='btn btn-ghost px-2 mx-1 mr-3' onClick={toggleFullScreen}>
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


