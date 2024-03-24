import { useNavigate } from "react-router-dom";



interface sourceProps{
    Name:string
}

const StreamNotFound: React.FC<sourceProps> = ({ Name }) => {
    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/Home');
    };
    return(
        <>
        <div className='flex flex-col justify-center items-center h-screen inset-0'>
            <h1>We couldn't find requested media!</h1>
            <p className="font-thin">{Name} is not found.</p>
            <button className="btn btn-wide" onClick={handleClick}>Back to homepage</button>
        </div>
        </>
    )
};

export default StreamNotFound;