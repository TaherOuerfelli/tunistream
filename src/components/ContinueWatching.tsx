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

export default function ContinueWatching(){
    const [IsEditing , setIsEditing] = useState<boolean>(false);
    const [mediaData , setMediaData] = useState<MediaData>({});
    useEffect(() => {
        let mediaData = {};
        try {
            const storedMediaData = localStorage.getItem('mediaData');
            if (storedMediaData) {
              mediaData = JSON.parse(storedMediaData);
              console.log("MEDIA DATA IN CONTINUE WATCHING:",mediaData);
              setMediaData(mediaData);
            }
          } catch (error) {
            console.error('Error parsing media data from localStorage:', error);
          }
    },[localStorage.getItem('mediaData')]);

      const handleEdit = () => {
        setIsEditing(!IsEditing);
      };
      const handleReset = ()=>{
        let mediaData = {};
        try {
            const storedMediaData = localStorage.getItem('mediaData');
            if (storedMediaData) {
              mediaData = JSON.parse(storedMediaData);
              console.log("MEDIA DATA IN CONTINUE WATCHING:",mediaData);
              setMediaData(mediaData);
            }
          } catch (error) {
            console.error('Error parsing media data from localStorage:', error);
          }
      };

    return(
        <>

        {Object.keys(mediaData).length > 0 && (
            <div className='flex flex-wrap justify-start gap-4 max-w-[23rem] sm:max-w-screen-lg mx-2  h-fit mt-10 transition-transform duration-500 ease-in-out'>
                <div className="flex flex-start w-[90vw] mx-auto h-fit justify-between">
                <div className='flex flex-row w-fit mt-3 gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <h1 className='text-xl font-bold '>CONTINUE WATCHING</h1>
                </div>
                <div className="h-5">
                    <button className="btn btn-circle btn-ghost rounded-full m-0 p-0" onClick={handleEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={IsEditing ? "currentcolor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                    </button>
                </div>
                </div>
                <div className="divider w-full h-0 m-0"></div>
                {Object.keys(mediaData).map((mediaID: string) => {
                  let season = '1';
                  let episode = '1';
                  let progress = null;

                  if (mediaID.startsWith('s')) { // If it's a series

                    const seriesData = mediaData[mediaID] as SeasonData[] | undefined;
                    if (seriesData && Array.isArray(seriesData)) {
                      seriesData.forEach((seasonData, seasonIndex) => {
                        if (Array.isArray(seasonData)) {
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
                  }

                  return (
                    <CardBookmark key={mediaID} mediaId={mediaID} session={season} episode={episode} progress={progress} isEditing={IsEditing} callBackFn={handleReset} deleteType="W"/>
                  );
                })}
            </div>
        )}

        </>
    )
};