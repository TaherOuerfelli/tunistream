import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Settings: React.FC = () => {
  //const { settings, toggleLanguage, toggleAppearance, toggleOtherSettings } = useSettings();

  return (
    <>
      <Header />

      <div className="flex flex-row my-10">
        <ul className="menu menu-lg bg-base-200 ml-10 mt-36 w-[35%] min-w-48 h-fit rounded-box sticky top-20">
          <h1 className="menu-title text-3xl font-bold ">
          Settings</h1>
          <div className='divider h-1 p-0 mx-[5%] my-0'></div>
          <li><a className=' text-xl'>Language</a></li>
          <li><a className=' text-xl'>Appearance</a></li>
          <li><a className=' text-xl'>Other Settings</a></li>
        </ul>
        <div className="container mx-10 bg-base-200 rounded-box h-screen w-full">
          <div className='mx-12'>
          <div className="w-full mt-10 ">
                <h1 className="mx-2 font-bold text-4xl ">Language:</h1>
                <div className="divider my-2 h-1"></div> 
              
                  <div className="dropdown mb-10">
                  <div tabIndex={0} role="button" className="btn btn-wide border-2 border-gray-600 text-xl m-1">



                    Select Language
                    <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
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
          <div className="w-full mt-10 ">
                <h1 className="mx-2 font-bold text-4xl ">Appearance:</h1>
                <div className="divider my-2 h-1"></div> 
                    
                <div className='flex flex-wrap gap-8'>
  
                <input type="radio" name="theme-radios" aria-label="Default" className="btn theme-controller" value="dark" onChange={() => localStorage.setItem('theme', 'dark')}/>
                <input type="radio" name="theme-radios" aria-label="Light" className="btn theme-controller" value="light" onChange={() => localStorage.setItem('theme', 'light')}/>
                <input type="radio" name="theme-radios" aria-label="Black" className="btn theme-controller" value="black" onChange={() => localStorage.setItem('theme', 'black')}/>
                <input type="radio" name="theme-radios" aria-label="Sunset" className="btn theme-controller" value="sunset" onChange={() => localStorage.setItem('theme', 'sunset')}/>
                <input type="radio" name="theme-radios" aria-label="Cyberpunk" className="btn theme-controller" value="cyberpunk" onChange={() => localStorage.setItem('theme', 'cyberpunk')}/>
                <input type="radio" name="theme-radios" aria-label="Synthwave" className="btn theme-controller" value="synthwave" onChange={() => localStorage.setItem('theme', 'synthwave')}/>
                <input type="radio" name="theme-radios" aria-label="Aqua" className="btn theme-controller" value="aqua" onChange={() => localStorage.setItem('theme', 'aqua')}/>


                </div>
          </div>
          <div className="w-full mt-10 ">
                <h1 className="mx-2 font-bold text-4xl ">Other Settings:</h1>
                <div className="divider my-2 h-1"></div> 
                
          </div>

          </div>
        </div>
           
      </div>
      
      <Footer />
    </>
  );
};

export default Settings;
