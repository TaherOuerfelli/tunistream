import { makeProviders, makeStandardFetcher,makeSimpleProxyFetcher, targets ,FullScraperEvents ,ScrapeMedia } from '@movie-web/providers';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSources from '../components/LoadingSources';
import { useState,useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StreamNotFound from '../components/StreamNotFound';

const proxyUrl = import.meta.env.PROXY_URL_LINK;

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl?proxyUrl:'', fetch),
  target: targets.BROWSER,
})




    // Define event listeners

      
      



    interface Quality {
      type: string;
      url: string;
      // Other properties if needed
  }



//{/>:null}
export default function Watch(){
  const { movieID } = useParams();

  const [startPlay , setStartPlay] = useState(false);
  const [notFoundMedia , setNotFoundMedia] = useState(false);
  const [StreamLink , setStreamLink] = useState('');
  const [mediaInfo, setMediaInfo] = useState<ScrapeMedia>({
    type: 'movie',
    title: '',
    releaseYear: 0,
    tmdbId: movieID || ''
  });

  const [sourceInfo, setSourceInfo] = useState({
    ID:'',
    status:'',
    per:0,
    discovered:false,
    embedID:'',
    found:false
  });
  const [sourceIds, setSourceIds] = useState( ['showbox', 'vidsrcto', 'zoechip', 'vidsrc', 'gomovies', 'ridomovies', 'flixhq', 'smashystream', 'remotestream']);


  // Extract search parameters using useSearchParams
  const [searchParams] = useSearchParams();

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
        embedID: evt.embeds[0].embedScraperId
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
  }, [sourceInfo]);
  useEffect(() => {
    console.log('Source Ids:', sourceIds);
  }, [sourceIds]);

  useEffect(() => {
    // Extract parameters from searchParams and update mediaInfo
    const title = searchParams.get('name');
    const releaseYear = searchParams.get('year');

    if (title && releaseYear) {
      setMediaInfo({
        ...mediaInfo,
        title: title,
        releaseYear: +releaseYear,
        tmdbId: movieID || ''
     });
    }
  }, [searchParams]);

  useEffect(() => {
    // Call providers.runAll() when mediaInfo changes
    if (mediaInfo.title && mediaInfo.releaseYear) {
      const fetchData = async () => {
        const output = await providers.runAll({ media: mediaInfo, events: eventListeners });
        if(output){
          const stream = output?.stream;
          console.log(stream)
          if(stream.type === 'file'){
          const qualityEntries : string[] = Object.keys(stream.qualities);
          const streamQualities : Record<string, Quality> = stream.qualities;
          const firstQuality : string = qualityEntries[2];
          console.log(firstQuality);
          const firstStream : Quality | undefined = streamQualities[firstQuality];
          console.log(firstStream);
          //console.log(firstStream.url);
        
        if(firstStream.url){
            setStreamLink(firstStream.url) 
            setNotFoundMedia(false)
        }}else{
          setNotFoundMedia(true)
        }
      }
      };
      fetchData();
    }
  }, [mediaInfo]);

  
  

    if(StreamLink !=='')
    {
      setTimeout(()=> setStartPlay(true),1500)
    }
    return(
        <>
<div className='bg-black'>
{startPlay  ? <VideoPlayer videoSrc={StreamLink} Name={mediaInfo.title}/> : null}
{notFoundMedia ? <StreamNotFound Name={mediaInfo.title}/>: null}
{!startPlay && !notFoundMedia  ? <LoadingSources sourceInfo={sourceInfo} sourceIds={sourceIds}/>:null}
</div>

                

        </>
    )
};