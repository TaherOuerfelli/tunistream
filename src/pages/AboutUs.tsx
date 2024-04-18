import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

export default function AboutUs(){
    useEffect (()=>scrollToTop(),[]);
    return(
        <>
        <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
        <Header/>
        <div className="flex justify-center w-full min-h-[61vh] h-fit my-12">
        <div className="bg-base-200 rounded-lg mx-10">
            <h1 className='flex justify-center items-start text-4xl font-bold mt-5 '>About us:</h1>
            <div className='m-10 h-[30rem] text-left text-base'>
                <p>TUNISTREAM.CLUB is a platform for streaming TV shows and movies <br></br>
                Uses The Movie Database <span  className="font-semibold italic">(TMDB)</span> for media information.<br></br>
                And works by searching the web for streams through various sources!</p>
                <p className="font-bold mt-10">- This site does not upload/host any of the streamed media.<br></br>
                There for has no control over whether the media is available or not. </p>
            </div>
        </div>
        </div>
        <Footer/>
        </div>
        
        <div className="drawer-side absolute z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-[15rem] min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li><div className="divider"></div></li>
          <li><a className="text-xl font-bold ">Profile</a></li>
          <li><Link to={'/Settings'} className="text-xl font-bold ">Settings</Link></li>
          <li><a className="text-xl font-bold text-red-500/85">Log out</a></li>
          
        </ul>
      </div>
      </div>
        </>
    )
};