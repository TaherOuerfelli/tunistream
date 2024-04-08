import { makeProviders, makeStandardFetcher,makeSimpleProxyFetcher, targets ,FullScraperEvents ,ScrapeMedia, StreamFile, Qualities } from '@movie-web/providers';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSources from '../components/LoadingSources';
import { useState,useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StreamNotFound from '../components/StreamNotFound';

const proxyUrl = import.meta.env.VITE_PROXY_URL_LINK;

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl?proxyUrl:'', fetch),
  target: targets.BROWSER,
  consistentIpForRequests: true,
  
})




    // Define event listeners

      
interface watchProps{
  MediaType : string;
}


const Watch: React.FC<watchProps> = ( { MediaType }) => {
  const { mediaID } = useParams();
  const { sessionIndex } = useParams();
  const { epIndex } = useParams();

  const [startPlay , setStartPlay] = useState(false);
  const [DoneFetching , setDoneFetching] = useState(false);
  const [FoundStream , setFoundStream] = useState(false);
  const [provider_id , setProviderId] = useState('');
  const [StreamLink , setStreamLink] = useState('');
  const [StreamType , setStreamType] = useState<"hls" | "file">('file');
  const [StreamQuality, setStreamQuality] = useState<Record<Qualities, StreamFile> | null>(null);
  const [mediaInfo, setMediaInfo] = useState<ScrapeMedia>(MediaType === "movie" ? {
    type: 'movie',
    title: '',
    releaseYear: 0,
    tmdbId: mediaID || ''
  }:
  {
    type: 'show',
    episode: {
        number: epIndex ? +epIndex : 0,
        tmdbId: '',
    },
    season: {
        number: sessionIndex ? +sessionIndex : 0,
        tmdbId: '',
    },
    title: '',
    releaseYear: 0,
    tmdbId: mediaID || ''
  }
  );



  const [sourceInfo, setSourceInfo] = useState({
    ID:'',
    status:'',
    per:0,
    discovered:false,
    embedID:'',
    embedSource:'',
    found:false
  });
  const [sourceIds, setSourceIds] = useState<string[]>([]);


  // Extract search parameters using useSearchParams
  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Extract parameters from searchParams and update mediaInfo
    const title = searchParams.get('name');
    const releaseYear = searchParams.get('year');
    const episodeID = searchParams.get('epID');
    const sessionID = searchParams.get('ssID');
    const IMDBID = searchParams.get('i');

    if (title && releaseYear) {
      MediaType === "movie" ? setMediaInfo({
        type:"movie",
        title: title,
        releaseYear: +releaseYear,
        tmdbId: mediaID || '',
        imdbId: IMDBID || ''
     }) : setMediaInfo({
        type:"show",
        title: title,
        releaseYear: +releaseYear,
        episode: {
          number: epIndex ? +epIndex : 0,
          tmdbId: episodeID? episodeID:'',
        },
        season: {
          number: sessionIndex ? +sessionIndex : 0,
          tmdbId: sessionID? sessionID:'',
        },
        tmdbId: mediaID || '',
        imdbId: IMDBID || ''
     });
    }
  }, [searchParams]);



  const eventListeners: FullScraperEvents = {
    update: (evt) => {
      console.log('Update event:', evt);
      setSourceInfo(prevSourceInfo => ({
        ...prevSourceInfo,
        ID: evt.id,
        status: evt.status,
        per: evt.percentage
      }));
    },
    init: (evt) => {
      console.log('Init event:', evt)
      setSourceIds(()=>evt.sourceIds);
  },
    discoverEmbeds: (evt) => {
      console.log('DiscoverEmbeds event:', evt);
      
      setSourceInfo(prevSourceInfo => ({
        ...prevSourceInfo,
        ID: evt.sourceId,
        discovered: true,
        embedID: evt.embeds[0].embedScraperId,
        embedSource: evt.sourceId
      }));
    },
    start: (id) => {
      console.log('Start event for ID:', id);
      setSourceInfo(prevSourceInfo => ({
        ...prevSourceInfo,
        ID: id,
      }));
    }
  };
  
  useEffect(() => {
    console.log('Source Info:', sourceInfo);
    setProviderId(sourceInfo.embedSource);
  }, [sourceInfo]);
  useEffect(() => {
    console.log('Source Ids:', sourceIds);
  }, [sourceIds]);

  

  useEffect(() => {
    // Call providers.runAll() when mediaInfo changes
    if (mediaInfo.title && mediaInfo.releaseYear) {
      const fetchData = async () => {
        console.log("MEDIA INFORMATION: ",mediaInfo)
        const output = await providers.runAll({ media: mediaInfo, events: eventListeners });
        if (output) {
          const { stream } = output;
          console.log(stream);
          if (stream.type === 'file') {
            const qualityEntries = Object.keys(stream.qualities);
            const streamQualities: Partial<Record<Qualities, StreamFile>> = stream.qualities;
            const firstQuality = qualityEntries[2]?qualityEntries[2]:qualityEntries[1]?qualityEntries[1]:qualityEntries[0];
            console.log(firstQuality);
            const firstStream = streamQualities[firstQuality as Qualities];
            console.log(firstStream);

            if (firstStream && firstStream.url) {
              setStreamType(stream.type as "hls" | "file");
              setStreamLink(firstStream.url);
              setStreamQuality(streamQualities as Record<Qualities, StreamFile>);
              setFoundStream(true);
            }
          } else { // Assuming the only other type is 'hls'
            setStreamType('hls');
            setStreamLink(stream.playlist);
            setFoundStream(true);
          }
        }
        setDoneFetching(true);
      };
      fetchData();
    }
  }, [mediaInfo]);
  
  

    if(FoundStream)
    {
      setTimeout(()=> setStartPlay(true),200)
    }
    return(
        <>
<div className='bg-black h-screen overflow-hidden'>
{startPlay  ? <VideoPlayer media={mediaInfo} videoSrc={StreamLink} provider_ID={provider_id} providersList={sourceIds} Name={mediaInfo.title} Stream_Type={StreamType} Quality={StreamQuality} mediaID={mediaID ?? ''} mediaType={MediaType} sessionIndex={sessionIndex ?? '1'} episodeIndex={epIndex ?? '1'}/> : null}
{!FoundStream && DoneFetching ? <StreamNotFound Name={mediaInfo.title} Season={sessionIndex??null} Episode={epIndex??null}/>: null}
{!startPlay && !DoneFetching  ? <LoadingSources sourceInfo={sourceInfo} sourceIds={sourceIds} gotLink={FoundStream}/>:null}
</div>

                

        </>
    )
};
export default Watch;