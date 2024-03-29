import React, { useRef } from 'react';

export const ItemScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -scrollRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: scrollRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div style={{ maxWidth: '1000px', display: 'flex', overflow: 'hidden', scrollBehavior: 'smooth', justifyContent: 'center' , alignItems: 'center'}}>
            <button className='btn btn-circle btn-ghost' onClick={scrollLeft}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div ref={scrollRef} style={{ display: 'flex', overflowX: 'hidden' }}>
                {children}
            </div>
            <button className='btn btn-circle btn-ghost' onClick={scrollRight}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
        </div>
    );
};
