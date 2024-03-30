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
})




    // Define event listeners

      
      




//{/>:null}
export default function Watch(){
  const { movieID } = useParams();

  const [startPlay , setStartPlay] = useState(false);
  const [DoneFetching , setDoneFetching] = useState(false);
  const [FoundStream , setFoundStream] = useState(false);
  const [StreamLink , setStreamLink] = useState('');
  const [StreamType , setStreamType] = useState<"hls" | "file">('file');
  const [StreamQuality, setStreamQuality] = useState<Record<Qualities, StreamFile> | null>(null);
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
    embedSource:'',
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
        if (output) {
          const { stream } = output;
          console.log(stream);
          if (stream.type === 'file') {
            const qualityEntries = Object.keys(stream.qualities);
            const streamQualities: Partial<Record<Qualities, StreamFile>> = stream.qualities;
            const firstQuality = qualityEntries[0];
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
<div className='bg-black'>
{startPlay  ? <VideoPlayer videoSrc={StreamLink} Name={mediaInfo.title} type={StreamType} Quality={StreamQuality}/> : null}
{!FoundStream && DoneFetching ? <StreamNotFound Name={mediaInfo.title}/>: null}
{!startPlay && !DoneFetching  ? <LoadingSources sourceInfo={sourceInfo} sourceIds={sourceIds} gotLink={FoundStream}/>:null}
</div>

                

        </>
    )
};