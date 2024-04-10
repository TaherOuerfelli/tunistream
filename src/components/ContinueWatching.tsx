import { useEffect, useState } from "react";
import CardBookmark from "./CardBookmark";



export default function ContinueWatching(){
    const [IsEditing , setIsEditing] = useState<boolean>(false);
    const [mediaData , setMediaData] = useState({});
    useEffect(() => {
        let mediaData = {};
        try {
            const storedMediaData = localStorage.getItem('mediaData');
            if (storedMediaData) {
              mediaData = JSON.parse(storedMediaData);
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
              setMediaData(mediaData);
            }
          } catch (error) {
            console.error('Error parsing media data from localStorage:', error);
          }
      };

    return(
        <>

        {Object.keys(mediaData).length > 0 && (
            <div className='flex flex-wrap justify-center gap-4 max-w-[23rem] sm:max-w-screen-lg sm:mx-auto h-fit mt-10 transition-transform duration-500 ease-in-out'>
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
                {Object.keys(mediaData).reduce((acc: { mediaId: string, session: string, episode: string }[], mediaID) => {
                    const mediaIdWithoutSession = mediaID.startsWith("m") ? mediaID : mediaID.slice(0, -2);
                    const session = mediaID.startsWith("m") ? '' : mediaID.slice(-2, -1);
                    const episode = mediaID.startsWith("m") ? '' : mediaID.slice(-1);
                    const existingIndex = acc.findIndex(item => item.mediaId === mediaIdWithoutSession);
                    if (existingIndex !== -1) {
                        if (parseInt(episode) > parseInt(acc[existingIndex].episode)) {
                            acc[existingIndex] = { mediaId: mediaIdWithoutSession, session, episode };
                        }
                    } else {
                        acc.push({ mediaId: mediaIdWithoutSession, session, episode });
                    }
                    return acc;
                }, []).reverse().map(({ mediaId, session, episode }) => (
                    <CardBookmark mediaId={mediaId} session={session} episode={episode} isEditing={IsEditing} callBackFn={handleReset} deleteType="W"/>
                ))}
            </div>
        )}

        </>
    )
};