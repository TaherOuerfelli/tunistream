import { useEffect, useState } from "react";
import CardBookmark from "./CardBookmark";

interface MovieData {
    time: number;
    progress: number;
  }
  
  interface EpisodeData {
    time: number;
    progress: number;
  }
  
  type SeasonData = EpisodeData[];
  
  type MediaData = {
    [key: string]: MovieData | SeasonData[];
  };

export default function Bookmarks(){
    const [IsEditing , setIsEditing] = useState<boolean>(false);
    const [mediaData , setMediaData] = useState<MediaData>({});
    const [bookmarks , setBookmarks] = useState<string | null>();
    const allBookmarks = [...new Set([...Object.keys(mediaData), ...(bookmarks ? JSON.parse(bookmarks) : [])])];
    useEffect(() => {
        let mediaData = {};
        let bookmarks = localStorage.getItem('bookmarks');
        console.log(bookmarks);
        setBookmarks(bookmarks);
        try {
            const storedMediaData = localStorage.getItem('mediaData');
            if (storedMediaData) {
              mediaData = JSON.parse(storedMediaData) as MediaData;
              setMediaData(mediaData);
            }
          } catch (error) {
            console.error('Error parsing media data from localStorage:', error);
          }
    },[]);

    const handleEdit = () => {
        setIsEditing(!IsEditing);
      };

      const handleReset = ()=>{
        let mediaData = {};
        let bookmarks = localStorage.getItem('bookmarks');
        setBookmarks(bookmarks);
        try {
            const storedMediaData = localStorage.getItem('mediaData');
            if (storedMediaData) {
              mediaData = JSON.parse(storedMediaData);
              setMediaData(mediaData);
            }
          } catch (error) {
            console.error('Error parsing media data from localStorage:', error);
          }
      };

    return(
        <>

        {bookmarks && JSON.parse(bookmarks).length > 0 && (
            <div className='flex flex-wrap justify-start gap-4 max-w-[23rem] sm:max-w-screen-lg mx-2 h-fit mt-10'>
                <div className="flex flex-start w-[90vw] h-fit justify-between">
                <div className='flex flex-row w-fit mt-3 gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    <h1 className='text-xl font-bold'>BOOKMARKS</h1>
                </div>
                <div className="h-5">
                <button className="btn btn-circle btn-ghost rounded-full m-0 p-0 hover:scale-125" onClick={handleEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={IsEditing ? "currentcolor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                    </button>
                </div>
                </div>
                <div className="divider w-full h-0 m-0"></div>
                

                {allBookmarks.filter(bookmark => bookmarks && bookmarks.includes(bookmark)).map((bookmark) => {
                  let season = '1';
                  let episode = '1';
                  let progress = null;

                  if (bookmark.startsWith('s')) { // If it's a series bookmark
                      const seriesBookmarks = mediaData[bookmark] as SeasonData[] | undefined;
                      if (seriesBookmarks && Array.isArray(seriesBookmarks)) {
                          seriesBookmarks.forEach((seasonData, seasonIndex) => {
                              if (Array.isArray(seasonData)) { // Additional check
                                  seasonData.forEach((episodeData, episodeIndex) => {
                                      if (episodeData && episodeData.time !== undefined) {
                                          season = String(seasonIndex);
                                          episode = String(episodeIndex);
                                          progress = episodeData.progress;
                                      }
                                  });
                              }
                          });
                      }
                  }else{
                    mediaData[bookmark] ? progress = (mediaData[bookmark] as MovieData).progress:progress=null;
                  }
                  return (
                      <CardBookmark key={bookmark} mediaId={bookmark} session={season} episode={episode} progress={progress} isEditing={IsEditing} callBackFn={handleReset} deleteType="B"/>
                  );
              })}
            </div>
        )}

        </>
    )
};