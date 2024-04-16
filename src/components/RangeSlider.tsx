import { useEffect, useRef, useState } from "react";

interface RangeSliderProps {
    min?: number;
    max?: number;
    Value: number;
    BufferValue: number;
    onChange: (value: number) => void;
  }

  const RangeSlider: React.FC<RangeSliderProps> = ({
    min = 0,
    max = 10000,
    Value = 0,
    BufferValue = 0,
    onChange,
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [Hovering , setHovering] = useState<boolean>(false);
    // Calculate the percentage for the filled track
    let trackFillPercentage =0;
    let trackBufferPercentage =0;
    const handleHoverChange = () => {
      let timeoutId;
      setHovering(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setHovering(false);
      }, 1000); // Adjust the delay time as needed
    };


    useEffect (()=>{
        if(inputRef.current){
            inputRef.current.value = '0';
        }
    },[]);
    useEffect (()=>{
        if(inputRef.current){
            inputRef.current.value = Value.toString();
        }
    },[Value]);
    if(inputRef.current){
            trackFillPercentage = ((+inputRef.current.value as number - min) / (max - min)) * 100;
            trackBufferPercentage = ((BufferValue - min) / (max - min)) * 100;
    }

  
    return (
      <div className="relative w-[95%] mb-2 mx-auto">
        {/* Track */}
        <div
          className={`h-1 rounded-full bg-gray-900/30 absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20`}
        />
        {/* Buffer Track */}
        <div
          className={`h-1 rounded-full bg-gray-400 absolute top-1/2 left-0 right-0 -translate-y-1/2 z-30`}
          style={{ width: `${trackBufferPercentage}%` }}
        />
        {/* Filled Track */}
        <div
          className={`h-1 rounded-full bg-blue-600 absolute top-1/2 left-0 right-0 -translate-y-1/2 z-30 duration-150 ${Hovering ? 'opacity-100':'opacity-80'}`}
          style={{ width: `${trackFillPercentage ?? ''}%` }}
        />
        {/* Thumb */}
        <svg xmlns="http://www.w3.org/2000/svg" className={`absolute w-4 transition-opacity duration-150 ${Hovering ? 'opacity-100':'opacity-0'} top-1/2 left-0 -translate-y-1/2 z-30 transition-transform duration-100 ${Hovering ? 'scale-100':'scale-0'}`}
        style={{ left: `${trackFillPercentage-0.6}%`}} viewBox="0 0 24 24" fill="rgb(59 130 246)" stroke="rgb(59 130 246)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
        <input
            ref={inputRef}
            type="range"
            min={min}
            max={max}
            className={`z-40 appearance-none opacity-0 h-0 w-full rounded-full absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer `}
            onChange={(e) => {handleHoverChange(); onChange(parseInt(e.target.value))}}
            onBlur={()=>setHovering(false)}
            onMouseEnter={()=>setHovering(true)}
            onMouseLeave={()=>setHovering(false)}
        />
      </div>
    );
  };
  
  export default RangeSlider;


