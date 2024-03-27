import CastMember from "../components/Cast";
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useState,useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";


const SEARCH_API_KEY = '22336235ae8cd5ba3de3feef1417f230';



const isArrayEmpty = (arr: any[]): boolean => {
    return Array.isArray(arr) && arr.length === 0;
};

export default function MoviePage(){
    const { movieID } = useParams();
    const navigate = useNavigate();
    const [movieData, setMovieData] = useState<any>({});
    const [creditsData, setCreditsData] = useState<any>({});
    useEffect(() => {
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieID}?api_key=${SEARCH_API_KEY}`
          );
          const data = await response.json();
          setMovieData(data);
          navigate(`/Movie/${movieID}?name=${data.title}&year=${data.release_date.substring(0, 4)}`);
          console.log('Movie/Show Details:', data);

            // Fetch movie credits
        const creditsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${SEARCH_API_KEY}`
          );
          const creditData = await creditsResponse.json();
          console.log('Crew Details:', creditData);
          setCreditsData(creditData)


        } catch (error) {
          console.error('Error fetching movie/show details:', error);
        }
      };
  
      fetchMovieDetails();
    }, [movieID]);

    const formatRuntime = (runtime: string): string => {
        const minutes = parseInt(runtime, 10);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours === 0) {
          return `${remainingMinutes}min`;
        } else if (remainingMinutes === 0) {
          return `${hours}h`;
        } else {
          return `${hours}h ${remainingMinutes}min`;
        }
      };
    
    let releaseYear = '';
    if (movieData.release_date) {
        releaseYear = movieData.release_date.substring(0, 4);
    }

    const backgroundImage = movieData.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
    : '';


    const posterUrl = movieData.poster_path
    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieData.poster_path}`
    : '';


    let genres ='';
    if (movieData.genres) {
        genres = movieData.genres.map((genre: { name: string }) => genre.name).join(', ');
    }

    let directorName ='null';
    if (creditsData.crew) {
         const director = creditsData.crew.find((crewMember: any) => crewMember.job === 'Director');
         if(director){ directorName = director.name;}
    }

    let Language = '';
    if(movieData.original_language){
        Language = movieData.original_language.toUpperCase()
    }

    let Country ='';
    if (movieData.production_countries && movieData.production_countries.length > 0) {
      Country = movieData.production_countries[0].name;
    }
    let runtime ='';
    if (movieData.runtime) {
      runtime = formatRuntime(movieData.runtime);
    }

    let voteAverage ='';
    let voteCount = '';
    if (movieData.vote_average && movieData.vote_count) {
      voteAverage = movieData.vote_average.toFixed(1);
      voteCount = movieData.vote_count;
    }


    if (!movieData || !creditsData) {
        return null; // Render nothing if data is not available yet
    }
    return(
        <>
        <Header/>
        <main className="w-full h-full" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="flex justify-center bg-base-200  bg-opacity-70 w-full ">
        <div className=" mx-10">
            <div className="flex flex-col bg-base-300 rounded-lg shadow-md mx-10 my-5 mt-10 bg-opacity-95">
            <div className='flex flex-row '>
                <img className=" w-1/3 h-1/3 rounded shadow-red-800" src={posterUrl} alt='{movieData.title} Poster Picture' />
                <div className="flex flex-col gap-2 w-1/2 m-5">
                    <h1 className="text-4xl font-bold ">{movieData.title}<p className="text-xl badge ml-2 p-3 shadow-md">{releaseYear}</p>
                    
                    </h1>
                    <div className="mx-2 font-bold text-1xl mt-5 ">
                        <h1>Genre: <span className="font-thin badge">{genres}</span></h1>
                        <div className="border-t  border-gray-500 my-2"></div>
                        
                        <h1>Director: <span className="font-thin">{directorName}</span></h1>
                        <div className="border-t border-gray-500 my-2"></div>
                        <h1>Language: <span className="font-thin">{Language}, {Country}</span></h1>
                        <div className="border-t border-gray-500 my-2"></div>
                        <h1>Duration: <span className="font-thin">{runtime}</span></h1>
                        <div className="border-t border-gray-500 my-2"></div>

                        <div className="tooltip font-thin" data-tip="TMDB Rating.">
                        <h1 className="flex flex-row font-bold">Ratings: <span className="font-thin text-xl ml-3">{voteAverage} </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 mx-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffcd00" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="arcs"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className="text-xs font-light mx-1 mt-2">vote count: {voteCount}</span>
                        </h1>
                        </div>
                        <div className="border-t border-gray-500 my-2"></div>
                        <Link to={`/Watch/Movie/${movieID}?name=${movieData.title}&year=${releaseYear}`} className="btn btn-block bg-white text-xl text-black hover:text-white font-bold mt-7 mr-1 ">
                        Watch Movie
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                        </Link>
                        <button className="btn btn-block shadow-xl text-xl font-bold mt-3 ">
                        Download
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3cd27e" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
                        </button>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="tooltip" data-tip="Bookmark">
                    <button className="btn btn-square shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                    </div>
                </div>
                
            </div>
                <div className=" mx-10 w-fit mt-10">
                    <h1 className="mx-2 font-bold text-2xl ">Overview:</h1>
                    <div className="border-t border-gray-500 my-2 w-full"></div>
                    <p className="text-xl mx-5 my-3 font-thin">{movieData.overview}</p>
                    
                </div>
                <div className="w-full mt-5">
                {!isArrayEmpty(creditsData.cast)  && <><h1 className="text-4xl font-bold mx-10">Cast</h1>
                    <div className="flex flex-wrap justify-start items-center mt-3 mx-5">
                    {creditsData.cast ? (creditsData.cast.slice(0,12).map((castMember: any) => (
                        <CastMember key={castMember.id} caster={castMember}/>
                    ))): null}

                    
                    </div></>}
                </div>
            </div>
        </div>
        </div>
        </main>
        <Footer/>
        </>
    )
};