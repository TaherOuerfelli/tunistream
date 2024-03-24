import { makeProviders, makeStandardFetcher,makeSimpleProxyFetcher, targets ,FullScraperEvents } from '@movie-web/providers';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSources from '../components/LoadingSources';
import { useState,useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StreamNotFound from '../components/StreamNotFound';

const proxyUrl = 'https://taupe-narwhal-20b068.netlify.app';//process.env.PROXY_URL_LINK;

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),
  target: targets.BROWSER,
})




    // Define event listeners

          
      
      







//{/>:null}
export default function Watch(){
  const { movieID } = useParams();

  const [startPlay , setStartPlay] = useState(false);
  const [notFoundMedia , setNotFoundMedia] = useState(false);
  const [StreamLink , setStreamLink] = useState('');
  const [mediaInfo, setMediaInfo] = useState({
    type: 'movie',
    title: '',
    releaseYear: '',
    tmdbId: movieID
  });

  const [sourceInfo, setSourceInfo] = useState({
    ID:'',
    status:'',
    per:0,
    dis:false,
    embedID:'',
    found:false
  });
  const [output, setOutput] = useState(null);

  // Extract search parameters using useSearchParams
  const [searchParams] = useSearchParams();

  const eventListeners: FullScraperEvents = {
    update: (evt) => {console.log('Update event:', evt);
    setSourceInfo({
      ...sourceInfo,
      ID : evt.id,
      status : evt.status,
      per : evt.percentage
    });
},
    init: (evt) => console.log('Init event:', evt),
    discoverEmbeds: (evt) => {console.log('DiscoverEmbeds event:', evt)
    setSourceInfo({
      ...sourceInfo,
      ID: evt.sourceId,
      dis : true,
      embedID : evt.embeds[0].embedScraperId
    });
  },
    start: (id) => {
      console.log('Start event for ID:', id);
      setSourceInfo({
        ...sourceInfo,
        ID: id,
      });
  }
  };

  useEffect(() => {
    // Extract parameters from searchParams and update mediaInfo
    const title = searchParams.get('name');
    const releaseYear = searchParams.get('year');

    if (title && releaseYear) {
      setMediaInfo({
        ...mediaInfo,
        title: title,
        releaseYear: releaseYear,
        tmdbId: movieID
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Call providers.runAll() when mediaInfo changes
    if (mediaInfo.title && mediaInfo.releaseYear) {
      const fetchData = async () => {
        const output = await providers.runAll({ media: mediaInfo, events: eventListeners });
        setOutput(output);
        if(output){
          const stream = output?.stream;
          console.log(stream)
          const qualityEntries = Object.keys(stream?.qualities);
          const streamQualities = stream?.qualities;
          const firstQuality = qualityEntries[2];
          //console.log(firstQuality);
          const firstStream = streamQualities[firstQuality];
          //console.log(firstStream);
          //console.log(firstStream.url);
        
        if(firstStream.url){
            setStreamLink(firstStream.url) 
            setNotFoundMedia(false)
        }}else{
          setNotFoundMedia(true)
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
{!startPlay && !notFoundMedia ? <LoadingSources sourceInfo={sourceInfo}/>:null}
</div>

                

        </>
    )
};