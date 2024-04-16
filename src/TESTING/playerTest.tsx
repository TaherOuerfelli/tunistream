import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';

function PlayerTest(){
    const videoRef = useRef<HTMLVideoElement>(null);
    const hls = useRef<Hls | null>(null);
    const [isHls , setIsHls] = useState<boolean>(false)
    const [url , setUrl] = useState<string>('')

    useEffect(() => {
        if (isHls) {
            if (Hls.isSupported()) {
                hls.current = new Hls();
                hls.current.loadSource(url);
                hls.current.attachMedia(videoRef.current as HTMLMediaElement);
            }
        } else {
                videoRef.current!.src = url;
        }
    }, [url]);
    const fetchData = async () => {
        try {
            const response = await fetch("https://prod-4-us.justbinge.lol/api/sources/94954/1/1?server=1");
            if (response.ok) {
                const data = await response.json();
                // Store the data in a variable here
                console.log(data);
            } else {
                throw new Error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    

    return (
        <>
        <div>
            <video ref={videoRef} autoPlay controls />
            <input type="text" placeholder="Enter video URL" onChange={(e) => {
                const url = e.target.value;
                setUrl(url)
            }} />
            <label>
                <input type="checkbox" onChange={(e) => setIsHls(e.target.checked)} /> HLS Video
            </label>
        </div>
        </>
    );
};

export default PlayerTest;


