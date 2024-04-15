import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const SEARCH_API_KEY:string = import.meta.env.VITE_TMDB_API_KEY;

interface InfoProps {
    name: string;
    season_number: number;
    id: string;
}

interface ShowProps {
    seasonsList: InfoProps[];
    ShowID: string;
    ShowIMDBID: string;
    ShowName:string;
    ShowReleaseDate:string;
}

const ShowSeasons: React.FC<ShowProps> = ({ seasonsList, ShowID , ShowIMDBID , ShowName , ShowReleaseDate }) => {
    const [selectedSeason, setSelectedSeason] = useState<number | null>(1);
    const [seasonEpisodes, setSeasonEpisodes] = useState<Record<string, any>>({});
    const [watchData, setWatchData] = useState<Record<string, any>>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeasonEpisodes = async () => {
            if (ShowID && selectedSeason !== null) {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${ShowID}/season/${selectedSeason}?api_key=${SEARCH_API_KEY}`);
                const data = await response.json();
                setSeasonEpisodes(prevState => ({
                    ...prevState,
                    [selectedSeason]: data.episodes
                }));
                console.log(seasonEpisodes);
            }
        };

        fetchSeasonEpisodes();
    }, [selectedSeason, ShowID]);

    useEffect(() => {
      let mediaData = {};
      try {
          const storedMediaData = localStorage.getItem('mediaData');
          if (storedMediaData) {
            mediaData = JSON.parse(storedMediaData);
            setWatchData(mediaData);
          }
        } catch (error) {
          console.error('Error parsing media data from localStorage:', error);
        }
    },[]);

    const handleSeasonClick = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber === selectedSeason ? null : seasonNumber);
    };
    if(!seasonsList) return <p>Series details are unavailable.</p>
    return (
        <>
            <ul className="menu menu-horizontal bg-base-200 text-xl font-bold">
                {seasonsList.map(season => (
                    <li key={season.season_number} onClick={() => handleSeasonClick(season.season_number)}>
                        <a className={season.season_number === selectedSeason ? "bg-white text-black hover:bg-white hover:text-black" : ""}>{season.name}</a>
                    </li>
                ))}
            </ul>

            {seasonsList.map(season => (
                selectedSeason === season.season_number && (
                    <div key={season.season_number} className="overflow-x-auto mt-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="w-[92px]"></th>
                                    <th>Episode Name</th>
                                    <th>Duration</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {seasonEpisodes[season.season_number] && seasonEpisodes[season.season_number].map((episode: any) => (
                                    <tr key={episode.id} className={` ${watchData[`s${ShowID}${season.season_number}${episode.episode_number}`] && watchData[`s${ShowID}${season.season_number}${episode.episode_number}`].progress > 0 ? 'bg-base-300':null} hover:bg-base-200 text-lg ${new Date(episode.air_date) > new Date() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => navigate(`/Watch/Series/${ShowID}/Season/${season.season_number}/Episode/${episode.episode_number}?name=${ShowName}&year=${ShowReleaseDate}&epID=${episode.id}&ssID=${season.id}&i=${ShowIMDBID}`)}>
                                        <th className="badge m-5">{episode.episode_number}</th>
                                        <td>{episode.name} {new Date(episode.air_date) > new Date() ? <span className='badge'>Not aired yet. </span>: ''}</td>
                                        <td>{episode.runtime} min</td>
                                        <td>
                                            <div className="radial-progress text-xs" style={{ "--value": watchData[`s${ShowID}${season.season_number}${episode.episode_number}`] ? `${watchData[`s${ShowID}${season.season_number}${episode.episode_number}`].progress}` : '0', "--size": "2.5rem", "--thickness": "5px" } as any} role="progressbar">
                                                {watchData[`s${ShowID}${season.season_number}${episode.episode_number}`] ? `${watchData[`s${ShowID}${season.season_number}${episode.episode_number}`].progress}%` : '0%'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                    <tr>
                                        <td colSpan={4}>{seasonEpisodes[season.season_number] && seasonEpisodes[season.season_number].length === 0 ? 
                                        (
                                            <div className='flex flex-row items-center bg-base-100 p-5 font-bold tracking-wide'>
                                                <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                            </span><p className='mx-5'>Episodes are currently not available for this Season.</p>
                                            </div>
                                            )
                                        : !seasonEpisodes[season.season_number] && <p>Loading</p>}</td>
                                    </tr>

                            </tbody>
                        </table>
                    </div>
                )
            ))}
        </>
    );
};

export default ShowSeasons;
