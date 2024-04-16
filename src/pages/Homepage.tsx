import { useState,useEffect, useRef } from "react"
import Results from "./Results";
import { Link, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Bookmarks from "../components/Bookmarks";
import ContinueWatching from "../components/ContinueWatching";



const SEARCH_API_KEY:string = import.meta.env.VITE_TMDB_API_KEY;

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
    const [theme , setTheme] = useState('dark');
    const [IsFocused , setIsFocused] = useState(false);
    const [IsSticky , setSticky] = useState(false);
    const stickyElementRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        let theme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', theme || 'dark');
        setTheme(theme ?? 'dark');
      },[])

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
    

      

      useEffect(() => {
        const handleScroll = () => {
          const stickyElement = stickyElementRef.current;
          if (!stickyElement) return;
    
          let rect = stickyElement.getBoundingClientRect();
          // Determine the threshold based on screen size
          let threshold = window.innerWidth <= 640 ? 100 : 5;
          if (rect.top <= threshold) {
            setSticky(true);
          } else {
            setSticky(false);
          }
        };
    
        // Attach scroll event listener
        window.addEventListener('scroll', handleScroll);
    
        // Cleanup
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
      

    return(
        <>
        <div className="drawer overflow-hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
        <Header isSticky={IsSticky}/>
        
        <div ref={stickyElementRef} className="pointer-events-none flex justify-center items-center sticky top-[63px] sm:top-1 left-1/4 my-10 z-40 h-14 w-[100vw]">
        <div className={`h-fit w-full transition-all duration-400 ${IsSticky? 'mx-[28%]':'mx-[27%]'} mt-2`}>
            <label className={`input input-bordered pointer-events-auto z-40 flex items-center w-full  gap-2 my-1 shadow-lg shadow-black/20 transition-all duration-400 ${IsFocused || !IsSticky? 'h-14 bg-base-300' : ' h-10 bg-base-200'}  ${theme === 'light' || theme === 'cyberpunk' ? 'border-1 border-black bg-gray-800' : 'border-1 border-gray'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`${IsFocused || !IsSticky? 'h-[18px] w-[18px]' : ' h-4 w-4'}opacity-70`} ><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                <input type="text" spellCheck="false" value={searchQuery ? searchQuery : ''} className="grow " placeholder="Search" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onChange={(e)=> {
                  setSearchQuery(e.target.value);
                    window.scrollTo({
                      top: 0,
                        behavior: 'auto' // Smooth scrolling animation
                      });

                    }}/>
            </label>
        </div></div>
        <div className="flex flex-col w-full justify-center items-center">
        {searchQuery ? (<Results results={searchResults} ISsearching={searching}/>):null}
        <Bookmarks/>
        <ContinueWatching />
        </div>
        <div className="h-[100vh]"></div>
        <Footer/>
        </div>
        <div className="drawer-side absolute z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-[15rem] min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li><div className="divider"></div></li>
          <li><a className="text-xl font-bold ">Profile</a></li>
          <li><Link to={'/Settings'} className="text-xl font-bold ">Settings</Link></li>
          <li><a className="text-xl font-bold text-red-500/85">Log out</a></li>
          
        </ul>
      </div>
      </div>
        </>
    )
};