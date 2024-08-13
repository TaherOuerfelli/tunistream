
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function NotFoundPage(){
  const navigate = useNavigate();
  const handleClick = () =>{
    navigate('/Home');
  };
  return(
    <>
    <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
        <Header/>
  <div className='flex flex-col min-h-[61vh] h-fit justify-center items-center my-0 sm:my-[3rem] gap-4'>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="1" stroke-linecap="square" stroke-linejoin="arcs"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
            <h1 className="mx-2">404 - Page Not Found</h1>
            <button className="btn btn-wide" onClick={handleClick}>Back to homepage</button>
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

export default NotFoundPage;