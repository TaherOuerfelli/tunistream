import React, { useEffect, useState, useRef } from 'react';

interface InfoProps {
    ID: string;
    status: string;
    per: number;
    discovered: boolean;
    embedID: string;
    embedSource: string;
    found: boolean;
}

interface SourceProps {
    sourceIds: string[];
    sourceInfo: InfoProps;
    gotLink : boolean;
}

interface SourceInfo {
    sourceID: string;
    status: string;
    per: number;
}

const LoadingSources: React.FC<SourceProps> = ({ sourceIds, sourceInfo , gotLink }) => {
    const [sourceInfos, setSourceInfos] = useState<SourceInfo[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sourceIds.length > 0) {
            const initialSourceInfos = sourceIds.map((sourceID, index) => ({
                sourceID,
                status: index === 0 ? sourceInfo.status : "", // Set statusInfo for each source based on its own index
                per: index === 0 ? sourceInfo.per : 0, // Set per for each source based on its own index
            }));
            setSourceInfos(initialSourceInfos);
        }
    }, [sourceIds, sourceInfo]);

    useEffect(() => {
        const index = sourceIds.findIndex(id => id === sourceInfo.ID);
        if (index !== -1) {
            setCurrentIndex(index);
            setSourceInfos(prevSourceInfos =>
                prevSourceInfos.map((sourceIn, idx) => {
                    if (idx === index) {
                        return { ...sourceIn, status: sourceInfo.status, per: sourceInfo.per };
                    }
                    return sourceIn;
                })
            );
        }
    }, [sourceInfo, sourceIds]);

    useEffect(() => {
        if (containerRef.current && containerRef.current.children.length > 0) {
            const containerWidth = containerRef.current.offsetWidth;
            const childWidth = containerRef.current.children[0].getBoundingClientRect().width || 0; // Use getBoundingClientRect for width
            // Calculate the offset to center the current element
            const initialOffset = (containerWidth / 2) - (childWidth / 2) - (childWidth * currentIndex);
            containerRef.current.style.transform = `translateX(${initialOffset}px)`;
        }
    }, [currentIndex, sourceInfos.length]);

    if (sourceInfos.length < 1) return null; // draw nothing if no sources
    return (
        <div className="flex flex-col scale-50 sm:scale-90 justify-center items-center gap-4 text-xl h-screen overflow-hidden">
            <div className="flex flex-row text-2xl font-bold gap-2 mb-5">
                <h1>Fetching results</h1>
                <span className="loading loading-ring loading-lg"></span>
            </div>
            <div className='flex flex-row justify-center items-center '>
                <div ref={containerRef} className='flex transition-all duration-500 gap-7'>
                    {sourceInfos.map((source, index) => (
                        <div key={source.sourceID} className={`flex flex-col justify-center items-center  transition-all duration-500 ${index !== currentIndex ? 'opacity-50 scale-90' : 'scale-125 '}  `}>
                            <div className="flex flex-row justify-center items-center text-center rounded-lg gap-2 px-10 py-7">
                                <div className=' w-[33px] h-[24px] '>
                                {((source.sourceID === sourceInfo.ID) || sourceInfo.embedSource.includes(source.sourceID)) ? (
                                    sourceInfo.discovered ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#4ee54d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    : 
                                    <div className={`radial-progress rounded-full `} style={{ "--value": source.per, "--size": "1.5rem", "--thickness": "5px" } as any} role="progressbar"></div>
                                ) : currentIndex > index ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff4242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                : null}
                                </div>
                                <p className="text-2xl ">{source.sourceID} <span className='text-xl text-gray-500 font-thin'>{source.status}</span></p>
                            </div>
                            {sourceInfo.discovered && (sourceInfo.embedSource.includes(source.sourceID)) &&
                                <div className="flex flex-row justify-center rounded-lg items-center gap-2 text-xl m-5 bg-base-200 p-3 scale-90">
                                    {!gotLink?<div className="radial-progress text-xs mt-1 rounded-full" style={{ "--value": sourceInfo.per, "--size": "1.5rem", "--thickness": "5px" } as any} role="progressbar"></div>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#4ee54d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                                    <p>{sourceInfo.embedID}</p>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default LoadingSources;

