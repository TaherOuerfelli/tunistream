import React from 'react';

interface InfoProps {
    ID: string;
    status: string;
    per: number;
    discovered: boolean;
    embedID: string;
    found: boolean;
}

interface SourceProps {
    sourceIds: string[];
    sourceInfo: InfoProps;
}

const LoadingSources: React.FC<SourceProps> = ({ sourceIds, sourceInfo }) => {
    return (
        <div className='flex flex-col justify-center items-center h-screen inset-0'>
            {sourceIds.map((sourceId, index) => (
                <div key={index} className="flex flex-col justify-center items-center">
                    <div className="flex flex-row text-xl gap-2 m-3">
                        <h1>Fetching results</h1>
                        <span className="loading loading-ring loading-sm"></span>
                    </div>
                    <div className="flex flex-row gap-2 bg-base-300 rounded-lg p-10">
                        <div className="radial-progress text-xs mt-1" style={{ "--value": sourceInfo.per, "--size": "1.5rem", "--thickness": "5px" } as any} role="progressbar"></div>
                        <p className="text-2xl ">{sourceId}  {sourceInfo.status}</p>
                    </div>
                    {sourceInfo.discovered &&
                        <div className="flex flex-row gap-2 text-xl m-5 bg-base-200 p-3 rounded-lg">
                            <div className="radial-progress text-xs mt-1" style={{ "--value": sourceInfo.per, "--size": "1.5rem", "--thickness": "5px" } as any} role="progressbar"></div>
                            <p>{sourceInfo.embedID}</p>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};

export default LoadingSources;