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
    <div className={`relative overflow-clip`} style={{ height: windowDimensions.height, width: windowDimensions.width,maxHeight:windowDimensions.height, overflow: 'hidden'  }}>

    <div className="absolute inset-0 w-full flex items-center justify-center">

{/* UI STARTS HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERE  */}
        <div className={`flex flex-row absolute top-5 left-0 transition-all duration-500 opacity-100 translate-y-0 z-50`}>
      <h1 className='text-white opacity-65 sm:opacity-80 text-xl ml-5 sm:ml-12 sm:mt-3 mt-20'>{Name} {mediaType === "movie" ? null: <span className='text-gray-400 font-thin'>S{sessionIndex}:E{episodeIndex}</span>}</h1>
      </div>
      
      <div className={`flex flex-row absolute top-5 right-0 transition-all duration-500 opacity-100 translate-y-0 z-50`}>
      <Link to='/Home' className="btn btn-ghost hidden sm:block text-lg sm:text-2xl absolute right-2 sm:right-10 top-2 sm:top-3 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text z-50" onClick={() => document.exitFullscreen()}>TUNISTREAM.CLUB</Link>
      </div>



    <div className={`absolute w-full h-fit bottom-0 pt-5 rounded-lg transition-all duration-200 opacity-100 translate-y-0 z-50`}>
   

        <div className='flex flex-row items-center mb-2 mt-2'>
        <button className='btn btn-ghost ml-7 px-2'>
         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
         </button>

      <button className='hidden sm:block btn btn-ghost px-3 '>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
      </button>
      <button className='hidden sm:block btn btn-ghost px-3 '>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
      </button>






    <div className='flex flex-row absolute right-3'>


      <button className='btn btn-ghost px-2 mx-1 mr-3' onClick={toggleFullScreen}>
      {document.fullscreenElement? <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>}
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


