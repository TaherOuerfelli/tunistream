import { useEffect, useRef } from "react";
import './RangeSlider.css'

interface RangeSliderProps {
    min?: number;
    max?: number;
    Value?: number;
    BufferValue?: number;
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

  
    return (

        <input
            ref={inputRef}
            type="range"
            min={min}
            max={max}
            className={'styled-slider buffer-track slider-progress w-full cursor-pointer'}
            style={{'--value': inputRef.current?.value, '--min': inputRef.current?.min == '' ? '0' : inputRef.current?.min, '--max': inputRef.current?.max == '' ? '100' : inputRef.current?.max , '--buffer-value':BufferValue} as any}
            onChange={(e) => {onChange(parseInt(e.target.value))}}
        />
    );
  };
  
  export default RangeSlider;


