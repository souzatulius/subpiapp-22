
import React from 'react';
import OriginsDemandChartCompact from './OriginsDemandChartCompact';

interface OriginsDemandCardWrapperProps {
  className?: string;
}

const OriginsDemandCardWrapper: React.FC<OriginsDemandCardWrapperProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <OriginsDemandChartCompact className="w-full h-full" />
    </div>
  );
};

export default OriginsDemandCardWrapper;
