
import React from 'react';
import OriginsDemandChart from '@/components/dashboard/cards/OriginsDemandChart';

const OriginsDemandChartWrapper: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return <OriginsDemandChart className={className} hideHeader={true} />;
};

export default OriginsDemandChartWrapper;
