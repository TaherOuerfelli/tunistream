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
        <div className="card btn max-w-56 h-fit bg-base-100 shadow-xl min-w-1/2 flex-grow" onClick={handleClick}>
        
        
        <div className="card-body mb-4 p-0">
        {isLoading ? <div className="skeleton w-48 h-80 mt-4"></div>:null}
        <img className="w-full h-full mt-4" src={info.posterUrl} alt={`${info.title} Poster`} style={{ display: !isLoading ? 'block' : 'none' }} 
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        />
            <h2 className="card-title">
            {info.title}
            </h2>
            <div className="card-actions justify-start">
            <span className="badge p-2 m-0">{info.releaseYear !== '' && info.releaseYear}</span>
            <div className="badge badge-outline">{mediatype}</div>
            </div>
        </div>
        </div>
        </>
    )
};
export default Card;