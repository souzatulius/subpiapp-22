
import React from 'react';

interface IndicatorCardProps {
  data: {
    total: string;
    details: {
      label: string;
      value: string;
    }[];
  };
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-4xl font-bold text-blue-600 mb-2">{data.total}</div>
      <div className="text-lg text-gray-500 mb-4">dias em média</div>
      
      <div className="w-full grid grid-cols-2 gap-4">
        {data.details.map((detail, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="text-xl font-semibold">{detail.value}</div>
            <div className="text-sm text-gray-500">{detail.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicatorCard;
