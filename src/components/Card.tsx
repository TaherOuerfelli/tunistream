import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SearchResult {
    id: number;
    type:string;
    title: string;
    releaseYear: string;
    posterUrl: string;
}
interface CardProps {
    info: SearchResult;
}

const Card: React.FC<CardProps> = ({ info }) => {
    const mediatype: string = info.type === 'movie' ? 'Movie' : 'Series';
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);



    const handleClick = () => {
        info.type == 'movie' ? navigate(`/Movie/${info.id}`) : navigate(`/Series/${info.id}`);
      };
    return(
        <>
        <div className="card btn max-w-[10rem] sm:max-w-[14rem]  h-fit bg-base-100 shadow-xl min-w-1/2 flex-grow" onClick={handleClick}>
        
        
        <div className="card-body mb-4 p-0">
        {isLoading ? <div className="skeleton w-48 h-80 mt-4"></div>:null}
        <img className="w-full h-full mt-4" src={info.posterUrl} alt={`${info.title} Poster`} style={{ display: !isLoading ? 'block' : 'none' }} 
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        />
            <h2 className="card-title text-sm sm:text-xl">
            {info.title}
            </h2>
            <div className="card-actions justify-start mt-1">
            <span className="badge text-xs sm:text-[0.875rem] p-2 mr-5 sm:mr-0">{info.releaseYear !== '' && info.releaseYear}</span>
            <div className="badge text-xs sm:text-[0.875rem] badge-outline p-2">{mediatype}</div>
            </div>
        </div>
        </div>
        </>
    )
};
export default Card;