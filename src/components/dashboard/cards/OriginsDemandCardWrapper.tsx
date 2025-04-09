
import React from 'react';
import OriginsDemandChartCompact from './OriginsDemandChartCompact';

const OriginsDemandCardWrapper: React.FC = () => {
  return (
    <div className="w-full h-full p-2">
      <OriginsDemandChartCompact className="w-full h-full" />
    </div>
  );
};

export default OriginsDemandCardWrapper;
