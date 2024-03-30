import React, { useState } from 'react';

interface ProgressBarProps {
  value: number;
  bufferValue: number;
  onProgressChange: (value: number) => void;
  onBufferChange: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, bufferValue, onProgressChange, onBufferChange }) => {
  const [progress, setProgress] = useState(value);
  const [buffer, setBuffer] = useState(bufferValue);

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +event.target.value;
    setProgress(newValue);
    onProgressChange(newValue);
  };

  const handleBufferChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +event.target.value;
    setBuffer(newValue);
    onBufferChange(newValue);
  };

  return (
    <div className="progress-bar">
      <input type="range" min={0} max={100} value={progress} onChange={handleProgressChange} />
      <input type="range" min={0} max={100} value={buffer} onChange={handleBufferChange} />
      <div className="progress-bar__buffer" style={{ width: `${buffer}%` }}></div>
      <div className="progress-bar__value" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;

