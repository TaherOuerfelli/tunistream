import { useState,useEffect } from "react"
import Results from "./Results";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";



const SEARCH_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

interface SearchResult {
  id: number;
  type:string;
  title: string;
  releaseYear: string;
  posterUrl: string;
}

export default function Homepage(){
    const [searchParams , setSearchParams] = useSearchParams();
    let query = searchParams.get('Search') ? searchParams.get('Search') : '';
    const [searchQuery,setSearchQuery] = useState(query);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        searchQuery ? setSearchParams({Search:searchQuery}):setSearchParams();
        if(searchQuery === null){setSearchQuery('')};
        const fetchSearchResults = async () => {
            try {
            setSearching(true);
              if (searchQuery?.trim() === '') {
                setSearchResults([]);
                setSearchQuery('');
                setTimeout(()=>setSearching(false),1500);
                return;
              }
      
              const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${SEARCH_API_KEY}&include_adult=false&query=${searchQuery}`
              );
              const data = await response.json();
      
              const results: SearchResult[] = data.results
                .filter((result: any) => result.media_type === 'movie' || result.media_type === 'tv')
                .map((result: any) => ({
                  id: result.id,
                  type:result.media_type,
                  title: result.title || result.name,
                  releaseYear: result.release_date ? result.release_date.substring(0, 4) : result.first_air_date?.substring(0, 4) || '',
                  posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.poster_path}` : ''
                }));
      
              setSearchResults(results);
              setTimeout(()=>setSearching(false),1500);
            } catch (error) {
              console.error('Error fetching search results:', error);
              setSearching(false);
            }
          };
      
          fetchSearchResults();
          console.log(searchResults);
      }, [searchQuery]);
    return(
        <>
        <Header/>
        <div className="sticky top-0 left-1/4 my-10 z-40 h-14 w-1/2">
        <div className=" flex justify-center items-start h-fit w-full">
            <label className="input input-bordered flex items-center gap-2 ml-10 my-1 h-14 w-full shadow-lg shadow-black/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                <input type="text" value={searchQuery ? searchQuery : ''} className="grow " placeholder="Search" onChange={(e)=> {
                    setSearchQuery(e.target.value);
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto' // Smooth scrolling animation
                      });

                    }}/>
            </label>
        </div></div>
        {searchQuery ? (<Results results={searchResults} ISsearching={searching}/>): <div className="h-screen"></div>}
        <Footer/>
        </>
    )
};