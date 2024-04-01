import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface CardProps {
    mediaId: string;
    session : string;
    episode : string;
    isEditing:boolean;
    callBackFn:Function;
    deleteType:'B'|'W';
}

const CardBookmark: React.FC<CardProps> = ({ mediaId , session , episode , isEditing , callBackFn ,deleteType}) => {
    const [mediaInfo, setMediaInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
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
                if ((key.startsWith('s') ? key.slice(0,-2) : key) === mediaId) {
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
        callBackFn();
    };
    return (
        <>
            {mediaInfo && (
                <div className={`card btn max-w-56 h-fit bg-base-100 shadow-xl ${theme === 'light' || theme === 'cyberpunk' ? 'border-1 border-black' : 'border-2 border-gray-700'}`} onClick={handleClick}>
                    {isEditing && <button className='btn btn-circle absolute z-40 scale-125 transition-transform transform hover:scale-150' onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>}
                    
                    <div className={`card-body relative  mb-4 p-0 ${isEditing ? 'blur-sm' : ''}`}>
                    <span className='bg-base-200 rounded-bl-lg  text-lg w-fit px-4 absolute right-0 top-4'>{mediaType === 'movie' ? null:`S${session}:E${episode}`}</span>
                        {isLoading ? <div className="skeleton w-48 h-80 mt-4"></div> : null}
                        {posterUrl ? <img
                            className="w-full h-full mt-4 "
                            src={posterUrl}
                            alt={`${mediaName} Poster`}
                            style={{ display: !isLoading ? 'block' : 'none' }}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                        />: <div className="skeleton w-full h-[200px]">Poster of {`${mediaName}`} is unavailable</div>}
                        <h2 className="card-title">{mediaName} </h2>
                        <div className="card-actions justify-start">
                            <span className="badge p-2 m-0">{releaseYear}</span>
                            <div className="badge badge-outline">{cardType}</div>
                        </div>
                    </div>
                </div>
                )}
        </>
    );
};
export default CardBookmark;
