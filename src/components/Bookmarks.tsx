import { useEffect, useState } from "react";
import CardBookmark from "./CardBookmark";



export default function Bookmarks(){
    const [IsEditing , setIsEditing] = useState<boolean>(false);
    const [mediaData , setMediaData] = useState({});
    const [bookmarks , setBookmarks] = useState<string | null>();
    useEffect(() => {
        let mediaData = {};
        let bookmarks = localStorage.getItem('bookmarks');
        console.log(bookmarks);
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
            <div className='flex flex-wrap justify-center gap-4 max-w-[23rem] sm:max-w-screen-lg sm:mx-auto h-fit mt-10'>
                <div className="flex flex-start w-[90vw] h-fit justify-between">
                <div className='flex flex-row w-fit mt-3 gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    <h1 className='text-xl font-bold'>BOOKMARKS</h1>
                </div>
                <div className="h-5">
                <button className="btn btn-circle btn-ghost rounded-full m-0 p-0" onClick={handleEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill={IsEditing ? "currentcolor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                    </button>
                </div>
                </div>
                <div className="divider w-full h-0 m-0"></div>
                {JSON.parse(bookmarks).reverse().map((mediaId: string) => {
                    let session = '1';
                    let episode = '1';
                    if (mediaId.startsWith('s')) {
                        const seriesId = mediaId.substring(1);
                        const highestSession = Object.keys(mediaData).filter(key => key.startsWith('s' + seriesId)).reduce((maxSession, currentSession) => {
                            const sessionIndex = parseInt(currentSession.substring(seriesId.length + 1, seriesId.length + 2));
                            return sessionIndex > maxSession ? sessionIndex : maxSession;
                        }, 1);
                        const highestEpisode = Object.keys(mediaData).filter(key => key.startsWith('s' + seriesId + highestSession)).reduce((maxEpisode, currentEpisode) => {
                            const episodeIndex = parseInt(currentEpisode.substring(seriesId.length + highestSession.toString().length + 1));
                            return episodeIndex > maxEpisode ? episodeIndex : maxEpisode;
                        }, 1);
                        session = highestSession.toString();
                        episode = highestEpisode.toString();
                    }
                    return (
                        <CardBookmark mediaId={mediaId} session={session} episode={episode} isEditing={IsEditing} callBackFn={handleReset} deleteType="B"/>
                    );
                })}
            </div>
        )}

        </>
    )
};