import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/videoplayer.css';


interface VideoProps{
    Name:string;
    mediaType:string;
    sessionIndex:string;
    episodeIndex:string;
  }



const PlaceholderVideoPlayer: React.FC<VideoProps> = ({Name, mediaType , sessionIndex , episodeIndex}) => {
//  const [theme , setTheme] = useState('dark');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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













  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  
  



  



  return (
    <>
    <div className={`relative overflow-hidden`} style={{ height: windowDimensions.height, width: windowDimensions.width,maxHeight:windowDimensions.height, overflow: 'hidden'  }}>

    <div className="absolute inset-0 w-full flex items-center justify-center">

{/* UI STARTS HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERE  */}
<div className={` absolute top-5 left-0 opacity-100 translate-y-0 z-50`}>
      <h1 className='text-white opacity-65 max-w-[70vw] sm:opacity-80 text-xl ml-5 sm:ml-12 sm:mt-[0.5rem] mt-[7vh]'>{Name} {mediaType === "movie" ? null: <span className='text-gray-400 font-thin'>S{sessionIndex}:E{episodeIndex}</span>}</h1>
      </div>
      
      <div className={`flex flex-row absolute top-5 right-0 opacity-100 translate-y-0 z-50`}>
      <Link to='/Home' className="btn btn-ghost text-lg sm:text-2xl absolute right-0 sm:right-5  top-2 sm:top-0 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text z-50" onClick={() => document.exitFullscreen()}>TUNISTREAM.CLUB</Link>
    </div>


    <div className={`absolute w-full h-fit bottom-0 pb-3 sm:pb-0 rounded-lg transition-all duration-300 opacity-100 translate-y-0 z-50`}>

        <div className='flex flex-start justify-between items-center  w-[80vw] mx-[10vw] sm:w-[97vw] sm:mx-[1.5vw] sm:-my-[8px]'>
        <div className='flex flex-row items-center  w-fit mb-4 '>
        <button className='btn btn-ghost opacity-70 px-2' >
        <span className="loading loading-spinner loading-md"></span>
         </button>

      <button className='hidden sm:block btn btn-ghost px-3 '>
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
      </button>
      <button className='hidden sm:block btn btn-ghost px-3 '>
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
      </button>

      </div>

        <div className='flex flex-row mb-4'>

          <button className='btn btn-ghost px-3' onClick={toggleFullScreen}>
          {document.fullscreenElement? <svg xmlns="http://www.w3.org/2000/svg" className='-mx-[0.1rem]' width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
          : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>}
          </button>
      </div>




      </div>
        </div>


        </div>
        </div>
    </>
  );
};

export default PlaceholderVideoPlayer;


