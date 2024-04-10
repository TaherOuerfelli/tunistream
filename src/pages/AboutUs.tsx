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
        <div className="flex justify-center w-full my-10">
        <div className="bg-base-200 rounded-lg mx-10">
            <h1 className='flex justify-center items-start text-4xl font-bold mt-5 '>About Us:</h1>
            <div className='m-10 h-[30rem] text-xl'>
                <p>TUNISTREAM.CLUB your one-stop destination for streaming movies, series, anime, and more!<br></br>
                It's a streaming platform – it's also a community.</p>
                <p className="font-bold mt-10">- This site does not upload/host any of the streamed media.</p>
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