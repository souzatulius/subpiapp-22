
import React from 'react';
import { widthOptions, heightOptions } from './utils';

interface DimensionOptionsProps {
  width: string;
  height: string;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
}

const DimensionOptions: React.FC<DimensionOptionsProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Largura</p>
        <div className="grid grid-cols-4 gap-2">
          {widthOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onWidthChange(option.value)}
              className={`
                p-2 rounded-md text-center text-sm border transition-all
                ${width === option.value ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Altura</p>
        <div className="grid grid-cols-2 gap-2">
          {heightOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onHeightChange(option.value)}
              className={`
                p-2 rounded-md text-center text-sm border transition-all
                ${height === option.value ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DimensionOptions;
