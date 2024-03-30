import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Settings: React.FC = () => {
  //const { settings, toggleLanguage, toggleAppearance, toggleOtherSettings } = useSettings();

  return (
    <>
      <Header />

      <div className="flex flex-rox my-10">
        <ul className="menu menu-lg bg-base-200 ml-10 mt-36 w-1/3 h-fit rounded-box sticky top-20">
          <h1 className="menu-title text-3xl font-bold ">Settings</h1>
          <li><a className=' text-xl'>Language</a></li>
          <li><a className=' text-xl'>Appearance</a></li>
          <li><a className=' text-xl'>Other Settings</a></li>
        </ul>
        <div className="container mx-10 bg-base-200 rounded-box h-screen w-full">
          <div className='mx-12'>
          <div className="w-full mt-10 ">
                <h1 className="mx-2 font-bold text-2xl ">Appearance:</h1>
                <div className="divider my-2 h-1"></div> 
                    
                <div className='flex flex-wrap gap-8'>
  
                <input type="radio" name="theme-radios" aria-label="Default" className="btn theme-controller" value="default"/>
                <input type="radio" name="theme-radios" aria-label="Light" className="btn theme-controller" value="light"/>
                <input type="radio" name="theme-radios" aria-label="Black" className="btn theme-controller" value="black"/>
                <input type="radio" name="theme-radios" aria-label="Sunset" className="btn theme-controller" value="sunset"/>
                <input type="radio" name="theme-radios" aria-label="Cyberpunk" className="btn theme-controller" value="cyberpunk"/>
                <input type="radio" name="theme-radios" aria-label="Synthwave" className="btn theme-controller" value="synthwave"/>
                <input type="radio" name="theme-radios" aria-label="Aqua" className="btn theme-controller" value="aqua"/>


                </div>
            </div>
            </div>
        </div>
           
      </div>
      
      <Footer />
    </>
  );
};

export default Settings;
