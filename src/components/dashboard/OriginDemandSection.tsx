
import React from 'react';
import OriginsDemandChart from './cards/OriginsDemandChart';

const OriginDemandSection: React.FC = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-3">Demandas da Semana</h2>
      <OriginsDemandChart />
    </div>
  );
};

export default OriginDemandSection;
