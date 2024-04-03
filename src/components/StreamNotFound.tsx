import { useNavigate,useLocation } from "react-router-dom";



interface sourceProps{
    Name:string;
    Season:string | null;
    Episode:string | null;
}

const StreamNotFound: React.FC<sourceProps> = ({ Name , Season , Episode}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const thereIsAPrevPage = location.key !== "default";

  const goBack = () => {
    if (thereIsAPrevPage) {
        // If there's a previous page, go back
        navigate(-1);
    } else {
        // If there's no previous page or no history state, navigate to /Home
        navigate('/Home');
    }
  };
    const handleClick = () =>{
        goBack();
    };
    return(
        <>
        <div className='flex flex-col justify-center items-center h-screen inset-0'>
            <h1 className="tracking-wide">We couldn't find requested media!</h1>
            <p className=" font-extrabold ">{Name} {Season?'S'+Season:null} {Episode?':E'+Episode:null} <span className="font-thin">is not found.</span></p>
            <button className="btn btn-wide mt-5" onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>
            Go Back</button>
        </div>
        </>
    )
};

export default StreamNotFound;