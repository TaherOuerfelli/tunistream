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
                <h1 className="mx-2 mb-4 font-bold text-4xl " >Language:</h1>
                <div className="divider my-2 h-1"></div> 
                <p className='m-3'>Select language for the entire Application.</p>
              
                  <div className="dropdown mb-10">
                  <div tabIndex={0} role="button" className="btn w-fit border-2 flex justify-between border-gray-600 text-xl m-1">
                  <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 -960 960 960"  fill='currentcolor' stroke='currentcolor'><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>
                  <span className='mr-5'>Select Language</span>
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
                <h1 className="mx-2 mb-4 font-bold text-4xl ">Appearance:</h1>
                <div className="divider my-2 h-1"></div> 
                    
                <div className='flex flex-wrap gap-8 m-3'>
  
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
                <h1 className="mx-2 mb-4 font-bold text-4xl ">Other Settings:</h1>
                <div className="divider my-2 h-1"></div> 
                <p className='h-[10rem] m-3'>subtitle settings/</p>
                
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
