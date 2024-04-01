import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface CardProps {
    mediaId: string;
    session : string;
    episode : string;
}

const CardBookmark: React.FC<CardProps> = ({ mediaId , session , episode}) => {
    const [mediaInfo, setMediaInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mediaType] = useState(mediaId.startsWith('m') ? 'movie' : 'tv');
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
                const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId.substring(1)}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
                const data = await response.json();
                console.log("BOOKMARK FETCH DATA: ", data);
                setMediaInfo(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching media info:', error);
            }
        };

        fetchMediaInfo();
    }, [mediaId]);

    const handleClick = () => {
        if (mediaInfo) {
            navigate(`/${mediaType === 'movie' ? 'Movie' : 'Series'}/${mediaInfo.id}`);
        }
    };

    const posterUrl = mediaInfo?.poster_path
        ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${mediaInfo.poster_path}`
        : '';
    
    let releaseYear = '';
    if (mediaInfo) {
        mediaType === 'movie' ?
        releaseYear = mediaInfo.release_date.substring(0, 4) :
        releaseYear = mediaInfo.first_air_date.substring(0, 4);
    }
    let mediaName = '';
    if (mediaInfo) {
        mediaType === 'movie' ?
        mediaName = mediaInfo.title :
        mediaName = mediaInfo.name;
    }
    let cardType = mediaType === 'movie' ?
    'Movie' :'Series';

    return (
        <>
            {mediaInfo && (
                <div className={`card btn max-w-56 h-fit bg-base-100 shadow-xl ${theme === 'light' || theme === 'cyberpunk' ? 'border-1 border-black' : 'border-2 border-gray-700'}`} onClick={handleClick}>
                    <div className="card-body mb-4 p-0 ">
                    <span className='bg-base-200 rounded-bl-lg  text-lg w-fit px-4 absolute right-4 top-4'>{mediaType === 'movie' ? null:`S${session}:E${episode}`}</span>
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
