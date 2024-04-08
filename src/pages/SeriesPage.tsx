import CastMember from "../components/Cast";
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useState,useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import ShowSeasons from "../components/ShowSeasons";
import { ItemScroll } from "../components/ItemScroll";


const SEARCH_API_KEY:string = import.meta.env.VITE_TMDB_API_KEY;


  

export default function SeriesPage(){
    const { seriesID } = useParams();
    const navigate = useNavigate();
    const [seriesData, setMovieData] = useState<any>({});
    const [creditsData, setCreditsData] = useState<any>({});
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [currentSeason , setCurrentSeason] = useState("1");
    const [currentEpisode , setCurrentEpisode] = useState("1");

    useEffect(() => {
      let mediaData = {};
      try {
          const storedMediaData = localStorage.getItem('mediaData');
          if (storedMediaData) {
            mediaData = JSON.parse(storedMediaData);
            Object.keys(mediaData).map((mediaID)=>{
              if(mediaID.slice(1, -2) === seriesID)
              {
                currentSeason < mediaID.slice(-2, -1) ? setCurrentSeason(mediaID.slice(-2, -1)):null;
                currentEpisode < mediaID.slice(-1)? setCurrentEpisode(mediaID.slice(-1)):null;
              }
            })
          }
        } catch (error) {
          console.error('Error parsing media data from localStorage:', error);
        }
    },[]);



    useEffect(() => {
      const checkSeriesExistence = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesID}?api_key=${SEARCH_API_KEY}`
          );
          if (response.status === 404) {
            navigate('/not-found');
          }
        } catch (error) {
          console.error('Error checking series existence:', error);
        }
      };

      checkSeriesExistence();
    }, [seriesID]);

    useEffect(() => {
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesID}?api_key=${SEARCH_API_KEY}`
          );
          const data = await response.json();
          setMovieData(data);
          navigate(`/Series/${seriesID}?name=${data.name}`);
          console.log('Movie/Show Details:', data);

            // Fetch movie credits
        const creditsResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesID}/credits?api_key=${SEARCH_API_KEY}`
          );
          const creditData = await creditsResponse.json();
          console.log('Crew Details:', creditData);
          setCreditsData(creditData)


        } catch (error) {
          console.error('Error fetching movie/show details:', error);
        }
      };
  
      fetchMovieDetails();
    }, [seriesID]);


    useEffect(() => {
      // Load bookmarks from localStorage on component mount
      const storedBookmarks = localStorage.getItem('bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    }, []);
  
    const toggleBookmark = () => {
      const updatedBookmarks = [...bookmarks];
      const index = updatedBookmarks.indexOf('s'+seriesID);
      if (index !== -1) {
        // If the movie name is already bookmarked, remove it
        updatedBookmarks.splice(index, 1);
      } else {
        // If the movie name is not bookmarked, add it
        updatedBookmarks.push('s'+seriesID);
      }
      setBookmarks(updatedBookmarks);
      // Update local storage
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    };



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
    if (seriesData.first_air_date) {
        releaseYear = seriesData.first_air_date.substring(0, 4);
    }

    const backgroundImage = seriesData.backdrop_path
    ? `https://image.tmdb.org/t/p/original${seriesData.backdrop_path}`
    : '';


    const posterUrl = seriesData.poster_path
    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${seriesData.poster_path}`
    : '';


    let genres ='Unavailable';
    if (seriesData.genres) {
        genres = seriesData.genres.map((genre: { name: string }) => genre.name).join(', ');
    }

    let directorName ='';
    try{
        if (seriesData.created_by) {
            directorName = seriesData.created_by[0].name;
        } 
    }catch (error) {
        if (creditsData.crew) {
            const director = creditsData.crew.find((crewMember: any) => crewMember.job === 'Original Story');
            if(director){ directorName = director.name;}
       }
        console.error('Error fetching creator for show:');
      }

    let Language = 'Unavailable';
    if(seriesData.original_language){
        Language = seriesData.original_language.toUpperCase()
    }

    let Country ='';
    if (seriesData.production_countries && seriesData.production_countries.length > 0) {
      Country = seriesData.production_countries[0].name;
    }
    let runtime ='Unavailable';
    if (seriesData.episode_run_time) {
      runtime = formatRuntime(seriesData.episode_run_time);
    }

    let voteAverage ='';
    let voteCount = 'Unavailable';
    if (seriesData.vote_average && seriesData.vote_count) {
      voteAverage = seriesData.vote_average.toFixed(1);
      voteCount = seriesData.vote_count;
    }
    let seriesName ='Unavailable';
    if (seriesData.name) {
        seriesName = seriesData.name;
    }

    if (!seriesData || !creditsData) {
        return null; // Render nothing if data is not available yet
    }
    return(
        <>
        <Header/>
        <main className="w-full h-full" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div role="Container" className="flex justify-center bg-base-200  bg-opacity-60 w-full ">
        <div className=" mx-5 sm:mx-10">
            <div className="flex flex-col bg-base-300 backdrop-blur-sm rounded-lg shadow-md mx-5 sm:mx-10 my-5 mt-10 bg-opacity-90">
            <div className='flex flex-col sm:flex-row '>
            {posterUrl ? <img className=" max-w-[25rem] sm:w-1/3 h-1/3 rounded shadow-red-800" src={posterUrl} alt='Poster Picture' /> : <div className="skeleton w-full sm:w-[20rem] h-[30rem]"></div>}
                <div className="flex flex-col gap-2 w-full sm:w-1/2 m-5">
                    <h1 className="text-4xl font-bold ">{seriesName}{releaseYear && <p className="text-xl badge ml-2 p-3 shadow-md">{releaseYear}</p>}
                    
                    </h1>
                    <div className="mx-2 font-bold text-1xl mt-5 ">
                        <h1>Genre: <span className="font-thin badge">{genres}</span></h1>
                        <div className="divider my-2 h-1"></div> 
                        
                        <h1>Creator: <span className="font-thin">{directorName}</span></h1>
                        <div className="divider my-2 h-1"></div> 
                        <h1>Language: <span className="font-thin">{Language}, {Country}</span></h1>
                        <div className="divider my-2 h-1"></div> 
                        <h1>Episode Duration: <span className="font-thin">{runtime}</span></h1>
                        <div className="divider my-2 h-1"></div> 

                        <div className="tooltip font-thin" data-tip="TMDB Rating.">
                        <h1 className="flex flex-row font-bold">Ratings: <span className="font-thin text-xl ml-3">{voteAverage} </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 mx-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffcd00" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="arcs"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className="text-xs font-light mx-1 mt-2">vote count: {voteCount}</span>
                        </h1>
                        </div>
                        <div className="divider my-2 h-1"></div> 
                        {new Date(seriesData.first_air_date) > new Date() ? <span className='alert'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {seriesData.status}</span>:
                        <Link to={`/Watch/Series/${seriesID}/Season/${currentSeason}/Episode/${currentEpisode}?name=${seriesName}&year=${releaseYear}`} className="btn btn-block bg-white text-xl text-black hover:text-white font-bold mt-7 mr-1 ">
                        {currentSeason !== "1" || currentEpisode !== "1" ? "Continue Watching":"Watch Now"} S{currentSeason}:E{currentEpisode}
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                        </Link>}
                        {/*
                        <button className="btn btn-block shadow-xl text-xl font-bold mt-3 ">
                        Download
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3cd27e" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
                        </button>*/}
                    </div>
                </div>
                <div className="mt-5">
                    <div className="tooltip" data-tip={bookmarks.includes('s'+seriesID?.toString()) ? `Remove "${seriesName}" from Bookmarks` : "Bookmark"}>
                    <button className="btn btn-square shadow-lg" onClick={toggleBookmark}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={bookmarks.includes('s'+seriesID?.toString()) ? "currentcolor" : "none"} stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                    </div>
                </div>
                
            </div>
            {seriesData.overview ?
                <div className=" mx-5 sm:mx-10 w-fit mt-10">
                    <h1 className="mx-2 font-bold text-2xl ">Overview:</h1>
                    <div className="divider my-2 h-1"></div> 
                    <p className="text-xl mx-5 my-3 font-thin">{seriesData.overview}</p>
                    
                </div>:null}
                <div className="mx-5 sm:mx-10 mt-10">
                <div className="divider my-2 h-1"></div> 
                  <ShowSeasons seasonsList={seriesData.seasons} ShowID={seriesData.id} ShowName={seriesName} ShowReleaseDate={releaseYear}/>
                  <div className="divider my-2 h-1"></div> 
                </div>
                    {creditsData.cast  && <><h1 className="text-4xl font-bold mx-5 sm:mx-10 mt-10">Cast</h1>
                <div className="flex flex-col w-full justify-center items-center">
                    <ItemScroll>
                    {creditsData.cast ? (creditsData.cast.map((castMember: any) => (
                      <div className="w-fit">
                          <CastMember key={castMember.id} caster={castMember}/>
                      </div>
                    ))): null}
                    </ItemScroll>
                    
                </div></>}
            </div>
        </div>
        </div>
        </main>
        <Footer/>
        </>
    )
};

