import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header({ isSticky }: { isSticky?: boolean }){
    useEffect(()=>{
        let theme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', theme || 'dark');
      },[])
      const scrollToTop = () => {
        window.scrollTo({ top: 0 });
      };
    return(
        <>
        <div className={`navbar absolute rounded-b-box transition-all ease-in-out ${isSticky && window.innerWidth <= 640  ? 'duration-250  pb-[60px]' : 'duration-0 '} bg-base-100 pointer-events-auto shadow-xl shadow-black/20 sticky top-0 z-40`}>
        <div className="flex-1 ">
        <label htmlFor="my-drawer" className="btn btn-ghost block sm:hidden drawer-button mt-5" onClick={scrollToTop}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="arcs"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </label>
            <Link to='/Home' className="btn btn-ghost mt-5 sm:mt-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text ">TUNISTREAM.CLUB</Link>
            <p className="text-gray-500 text-xs">v1.01</p>
        </div>
        <div className="flex-none gap-2 ">
            <div className="hidden sm:block dropdown dropdown-end">

            <div tabIndex={0} role="button" className="btn btn-ghost avatar ">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                <div className=" w-10 ">
                <img alt="Tailwind CSS Navbar component" src="https://i.ibb.co/qN55V5Z/360-F-64676383-Ldbmhi-NM6-Ypzb3-FM4-PPu-FP9r-He7ri8-Ju.jpg" />
                </div> 
            </div>

            <ul tabIndex={0} className="mt-3  p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                <a className="justify-between tracking-wide text-lg btn-disabled opacity-50">
                    Profile
                    {/*<span className="badge">New</span>*/}
                </a>
                </li>
                <li><Link to='/Settings' className="text-lg tracking-wide ">Settings</Link></li>
                <li><a className="text-lg tracking-wide text-red-500/85 btn-disabled opacity-50">Logout</a></li>
            </ul>
            </div>
        </div>
        </div>
        </>
    )
};