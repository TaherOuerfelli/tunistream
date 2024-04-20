import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface CardProps {
    mediaId: string;
    session : string;
    episode : string;
    progress?:number | null;
    isEditing:boolean;
    callBackFn:Function;
    deleteType:'B'|'W';
}

const CardBookmark: React.FC<CardProps> = ({ mediaId , session , episode , progress , isEditing , callBackFn ,deleteType}) => {
    const [mediaInfo, setMediaInfo] = useState<any>(null);
    const [isHovered, setHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [mediaType , setMediaType] = useState(mediaId.startsWith('m') ? 'movie' : 'tv');
    const [mediaData , setMediaData] = useState({});
    const [bookmarks , setBookmarks] = useState<string | null>('');
    const navigate = useNavigate();
    const [theme , setTheme] = useState('dark');
    useEffect(()=>{
        let theme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', theme || 'dark');
        setTheme(theme ?? 'dark');
      },[])

    useEffect(() => {
        const fetchMediaInfo = async () => {
            try {
                setMediaType(mediaId.startsWith('m') ? 'movie' : 'tv');
                const response = await fetch(`https://api.themoviedb.org/3/${mediaId.startsWith('m') ? 'movie' : 'tv'}/${mediaId.substring(1)}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
                const data = await response.json();
                setMediaInfo(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching media info:', error);
            }
        };

        fetchMediaInfo();
    }, [mediaId,mediaData,bookmarks]);

    const handleClick = () => {
        if (mediaInfo && !isEditing) {
            navigate(`/${mediaType === 'movie' ? 'Movie' : 'Series'}/${mediaInfo.id}`);
        }
    };

    const posterUrl = mediaInfo?.poster_path
        ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${mediaInfo.poster_path}`
        : '';
    
    let releaseYear = '';
    if (mediaInfo) {
        mediaType === 'movie' ?
        releaseYear = mediaInfo?.release_date?.substring(0, 4) :
        releaseYear = mediaInfo?.first_air_date?.substring(0, 4);
    }
    let mediaName = '';
    if (mediaInfo) {
        mediaType === 'movie' ?
        mediaName = mediaInfo?.title :
        mediaName = mediaInfo?.name;
    }
    let cardType = mediaType === 'movie' ?
    'Movie' :'Series';

    const handleDelete = () => {
        setIsDeleted(true);
        setTimeout(() =>{
            if(deleteType === "W"){
                let mediaData = {};
                try {
                    const storedMediaData = localStorage.getItem('mediaData');
                    if (storedMediaData) {
                    mediaData = JSON.parse(storedMediaData);
                    setMediaData(mediaData);
                    console.log("MEDIADATA",mediaData);
                    }
                } catch (error) {
                    console.error('Error parsing media data from localStorage:', error);
                }
                if(mediaData){
                let updatedMediaData: { [key: string]: any }  = { ...mediaData };
                Object.keys(updatedMediaData).map((key) => {
                    if (key === mediaId) {
                        delete updatedMediaData[key];
                    }
                });
                    console.log("MEDIADATA AFTER: ",updatedMediaData);
                    localStorage.setItem('mediaData',JSON.stringify(updatedMediaData));
                
                }
            }
            if(deleteType === "B"){
                let bookmarks = localStorage.getItem('bookmarks');
                let updatedBookmarks = [];
                setBookmarks(bookmarks);
                if(bookmarks){
                    updatedBookmarks = JSON.parse(bookmarks);
                    updatedBookmarks = updatedBookmarks.filter((item : string) => item !== mediaId);
                    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
                }
            }
            setIsDeleted(false);
            callBackFn();
    },400);
    };
    return (
        <>
            {mediaInfo && (
                <div className={`card  ${theme === 'black' || theme === 'cyberpunk' ? 'rounded-none' : 'rounded-md'} p-0 btn max-w-[10rem] sm:max-w-[15rem] h-fit bg-base-100/50 shadow-xl ${theme === 'light' || theme === 'cyberpunk' ? 'border-1 border-black' : theme === 'black' ? 'border-2 border-gray-700':'border-2 border-gray-800'} transition-all  ${isDeleted? 'duration-500 w-0 opacity-0' : 'opacity-100 duration-0 w-56'}`} onClick={handleClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} >
                    
                    
                    <div className="card-body relative mb-4 p-0">
                        
                    <div>
                        <div className='absolute w-full h-full bg-transparent z-40'> <button className={`btn btn-circle mt-[75%]  z-40 scale-125 transition-all transform hover:scale-150 duration-150 ${isEditing ? 'opacity-100 ':'opacity-0 scale-50 '}`} onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button> </div>

                    <div className={`transition-all duration-300 ${isEditing ? 'blur-sm' : 'blur-none'}`}>

                    <span className={` transition-all duration-400 ${isHovered ? 'text-white text-[1.15rem]/[1.65rem]':'text-gray-350 text-[1rem]/[1.5rem]'} bg-base-300 rounded-box  font-medium tracking-widest w-fit p-0 px-3 absolute right-2 top-2`}>{mediaType === 'movie' ? null:<p>S{session} E{episode}</p>}</span>
                        {isLoading ? <div className="skeleton w-48 h-80 mt-4"></div> : null}
                        {posterUrl ? <img
                            className={`w-full h-full ${theme === 'black' || theme === 'cyberpunk' ? 'rounded-none' : 'rounded-t-md'} `}
                            src={posterUrl}
                            alt={`${mediaName} Poster`}
                            style={{ display: !isLoading ? 'block' : 'none' }}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                        />: <div className="skeleton w-full h-[250px]">Poster of {`${mediaName}`} is unavailable</div>}
                        {progress && <div className='absolute w-full bottom-0 p-7' style={{
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.8869922969187675) 0%, rgba(0,0,0,0.8841911764705882) 20%, rgba(0,0,0,0.5704656862745099) 60%, rgba(0,0,0,0) 100%)'}}>
                        <progress className={`progress ${theme === 'black' || theme === 'dark' ? null:'progress-accent'} w-[85%] h-[0.3rem] bg-black/30 absolute  bottom-3 right-[6%]`} value={progress} max="100"></progress></div>}
                        </div>
                        </div>
                        <h2 className={`card-title text-[1.15rem] justify-center sm:justify-start mx-[7%] sm:text-xl transition-all ${isDeleted? 'duration-100 opacity-0':'duration-0 opacity-100'}`}>{mediaName} </h2>
                        <div className="card-actions justify-center sm:justify-start  mx-[7%] mt-1">
                            <span className="badge text-xs sm:text-[0.875rem] p-2 mr-4 sm:mr-0">{releaseYear}</span>
                            <div className="badge text-xs sm:text-[0.875rem] badge-outline p-2">{cardType}</div>
                        </div>
                    </div>
                </div>
                )}
        </>
    );
};
export default CardBookmark;
