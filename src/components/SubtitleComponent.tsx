import { useState, useEffect } from 'react';

interface SubtitlesComponentProps {
  url: string;
  currentTime: number;
}

function SubtitlesComponent({ url, currentTime }: SubtitlesComponentProps) {
  const [subtitles, setSubtitles] = useState('');
  const [SubtitleText, setCurrentSubtitle] = useState('');

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        setSubtitles(text);
      })
      .catch((error) => {
        console.error('Error loading subtitles:', error);
      });
  }, [url]);
    // Logic to extract the relevant subtitle at the specified currentTime
  const extractSubtitle = (currentTime: number, subtitlesText: string): string => {
    const subtitleLines = subtitlesText.split(/\r?\n\r?\n/);
    for (let i = 0; i < subtitleLines.length; i++) {
      const subtitleParts = subtitleLines[i].split('\n');
      if (subtitleParts.length >= 3) {
        const times = subtitleParts[1].split(' --> ');
        if (times.length === 2) {
          const startTime = timeStringToSeconds(times[0]);

          
          const endTime = timeStringToSeconds(times[1]);
          if (currentTime >= startTime && currentTime <= endTime) {
            return subtitleParts.slice(2).join(' ');
          }
        }
      }
    }
    return '';
  };

  function timeStringToSeconds(timeString: string): number {
    const [timef,] = timeString.split(',')
    const [hh, mm, ss] = timef.split(':').map(Number);
    const millisecondsMatch = timeString.match(/,(\d+)/);
    const milliseconds = millisecondsMatch ? parseInt(millisecondsMatch[1], 10) : 0;
    const totalSeconds = hh * 3600 + mm * 60 + ss + milliseconds / 1000;
    return totalSeconds;
  }
  useEffect(()=>setCurrentSubtitle(extractSubtitle(currentTime, subtitles)),[subtitles,currentTime]);

  return <span dangerouslySetInnerHTML={{ __html: SubtitleText }} />;
}

export default SubtitlesComponent;