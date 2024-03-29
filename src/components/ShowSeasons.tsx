import React, { useState, useEffect } from 'react';

const SEARCH_API_KEY:string = import.meta.env.VITE_TMDB_API_KEY;

interface InfoProps {
    name: string;
    season_number: number;
    id: string;
}

interface ShowProps {
    seasonsList: InfoProps[];
    ShowID: string;
}

const ShowSeasons: React.FC<ShowProps> = ({ seasonsList, ShowID }) => {
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [seasonEpisodes, setSeasonEpisodes] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchSeasonEpisodes = async () => {
            if (ShowID && selectedSeason !== null) {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${ShowID}/season/${selectedSeason}?api_key=${SEARCH_API_KEY}`);
                const data = await response.json();
                setSeasonEpisodes(prevState => ({
                    ...prevState,
                    [selectedSeason]: data.episodes
                }));
            }
        };

        fetchSeasonEpisodes();
    }, [selectedSeason, ShowID]);

    const handleSeasonClick = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber === selectedSeason ? null : seasonNumber);
    };
    if(!seasonsList) return <p>Season details unavailable.</p>
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
                                {seasonEpisodes[season.season_number] ? seasonEpisodes[season.season_number].map((episode: any) => (
                                    <tr key={episode.id} className="hover:bg-base-100 hover:cursor-pointer text-lg">
                                        <th className="badge m-5">{episode.episode_number}</th>
                                        <td>{episode.name}</td>
                                        <td>{episode.runtime} min</td>
                                        <td>
                                            <div className="radial-progress text-xs" style={{ "--value": "0", "--size": "2.5rem", "--thickness": "5px" } as any} role="progressbar">
                                                0%
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4}><p>Loading</p></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            ))}
        </>
    );
};

export default ShowSeasons;
