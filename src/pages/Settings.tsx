import React, { useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  //const { settings, toggleLanguage, toggleAppearance, toggleOtherSettings } = useSettings();
  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  useEffect (()=>scrollToTop(),[]);
  const scrollToElement = (reference: React.RefObject<HTMLDivElement>) => {
    if (reference.current) {
      reference.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
      <Header />

      <div className="flex flex-row my-10">
        <ul className="hidden sm:block menu menu-lg bg-base-200 ml-10 mt-36 w-[35%] min-w-48 h-fit rounded-box sticky top-20">
          <h1 className="menu-title text-3xl font-bold ">
          Settings</h1>
          <div className='divider h-1 p-0 mx-[5%] my-0'></div>
          <li><a className=' text-xl' onClick={() =>scrollToElement(langRef)}>Language</a></li>
          <li><a className=' text-xl' onClick={() =>scrollToElement(themeRef)}>Appearance</a></li>
          <li><a className=' text-xl' onClick={() =>scrollToElement(otherRef)}>Other Settings</a></li>
        </ul>
        <div className="container sm:mx-10 bg-base-200 rounded-box h-fit w-full" >
          <div className='mx-12' >
          <div className="w-full mt-10 " ref={langRef}>
                <h1 className="mx-2 font-bold text-4xl " >Language:</h1>
                <div className="divider my-2 h-1"></div> 
              
                  <div className="dropdown mb-10">
                  <div tabIndex={0} role="button" className="btn btn-wide border-2 flex justify-between border-gray-600 text-xl m-1">
                    <span>Select Language</span>
                    <svg width="20px" height="20px" className="h-3 w-3 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
                  </div>

                  <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
                    <li>
                      <button className="btn btn-sm btn-block btn-ghost justify-start text-xl" value="
                    default">
                      <div className='flex flex-row w-full justify-between'>
                      English 
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#008c07" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                  </button>
                  </li>
                  <div className="divider my-0 h-1"></div> 
                  <li>
                      <button className="btn btn-sm btn-block btn-disabled btn-ghost justify-start text-xl" value="
                    default">
                      العربية 
                  </button>
                  </li>
                  <div className="divider my-0 h-1"></div> 
                  <li>
                      <button className="btn btn-sm btn-block btn-disabled btn-ghost justify-start text-xl" value="
                    default">
                      Français 
                  </button>
                  </li>
                  </ul>
                </div>


                
          </div>
          <div className="w-full mt-10 " ref={themeRef}>
                <h1 className="mx-2 font-bold text-4xl ">Appearance:</h1>
                <div className="divider my-2 h-1"></div> 
                    
                <div className='flex flex-wrap gap-8'>
  
                <input type="radio" name="theme-radios" aria-label="Default" className="btn theme-controller" value="dark" onChange={() => localStorage.setItem('theme', 'dark')}/>
                <input type="radio" name="theme-radios" aria-label="Light" className="btn theme-controller" value="nord" onChange={() => localStorage.setItem('theme', 'nord')}/>
                <input type="radio" name="theme-radios" aria-label="Black" className="btn theme-controller" value="black" onChange={() => localStorage.setItem('theme', 'black')}/>
                <input type="radio" name="theme-radios" aria-label="Sunset" className="btn theme-controller" value="sunset" onChange={() => localStorage.setItem('theme', 'sunset')}/>
                <input type="radio" name="theme-radios" aria-label="Cyberpunk" className="btn theme-controller" value="cyberpunk" onChange={() => localStorage.setItem('theme', 'cyberpunk')}/>
                <input type="radio" name="theme-radios" aria-label="Synthwave" className="btn theme-controller" value="synthwave" onChange={() => localStorage.setItem('theme', 'synthwave')}/>
                <input type="radio" name="theme-radios" aria-label="Aqua" className="btn theme-controller" value="aqua" onChange={() => localStorage.setItem('theme', 'aqua')}/>


                </div>
          </div>
          <div className="w-full mt-10 " ref={otherRef}>
                <h1 className="mx-2 font-bold text-4xl ">Other Settings:</h1>
                <div className="divider my-2 h-1"></div> 
                <p className='h-[10rem]'>subtitle settings/</p>
                
          </div>

          </div>
        </div>
           
      </div>
      
      <Footer />
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
  );
};

export default Settings;
