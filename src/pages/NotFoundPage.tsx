
import { useNavigate } from 'react-router-dom';

function NotFoundPage(){
  const navigate = useNavigate();
  const handleClick = () =>{
    navigate('/Home');
  };
  return(
  <div className='flex flex-col h-screen justify-center items-center my-32 gap-4'>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="1" stroke-linecap="square" stroke-linejoin="arcs"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
            <h1 className="mx-2">404 - Page Not Found</h1>
            <button className="btn btn-wide" onClick={handleClick}>Back to homepage</button>
      </div>
      )
};

export default NotFoundPage;