import CardBookmark from "./CardBookmark";



export default function Bookmarks(){
    let bookmarks = localStorage.getItem('bookmarks');
    console.log("Bookmarks:",bookmarks)

    let mediaData = {};
    try {
        const storedMediaData = localStorage.getItem('mediaData');
        if (storedMediaData) {
          mediaData = JSON.parse(storedMediaData);
        }
      } catch (error) {
        console.error('Error parsing media data from localStorage:', error);
      }

    return(
        <>

        {bookmarks && JSON.parse(bookmarks).length > 0 && (
            <div className='flex flex-wrap justify-start gap-4 max-w-screen-lg mx-auto h-fit mt-10'>
                <div className="flex flex-start w-full h-fit justify-between">
                <div className='flex flex-row w-fit mt-3 gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    <h1 className='text-xl font-bold'>BOOKMARKS</h1>
                </div>
                <div className="h-5">
                    <button className="btn btn-circle btn-ghost rounded-full m-0 p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
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
                }, []).filter(item => bookmarks && bookmarks.includes(item.mediaId)).map(({ mediaId, session, episode }) => (
                    <CardBookmark mediaId={mediaId} session={session} episode={episode} />
                ))}
            </div>
        )}

        </>
    )
};