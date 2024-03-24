import { Link } from "react-router-dom";


export default function Header(){
    return(
        <>
        <div className="navbar bg-base-100 shadow-xl shadow-black/20 sticky top-0 z-30">
        <div className="flex-1 ">
            <Link to='/Home' className="btn btn-ghost text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text ">TUNISTREAM.CLUB</Link>
            <p className="text-gray-500 text-xs">v1.01</p>
        </div>
        <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">

            <div tabIndex={0} role="button" className="btn btn-ghost avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                <div className=" w-10 ">
                <img alt="Tailwind CSS Navbar component" src="https://i.ibb.co/qN55V5Z/360-F-64676383-Ldbmhi-NM6-Ypzb3-FM4-PPu-FP9r-He7ri8-Ju.jpg" />
                </div> 
            </div>

            <ul tabIndex={0} className="mt-3 z-[50] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </a>
                </li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
            </ul>
            </div>
        </div>
        </div>

        </>
    )
};