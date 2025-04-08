
import React from 'react';
import ChartCard from './ChartCard';

interface OldestPendingListProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const OldestPendingList: React.FC<OldestPendingListProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate oldest pending list data
  const generateOldestPendingData = React.useMemo(() => {
    const companies = [
      { name: 'Enel', days: 76, count: 12 },
      { name: 'Sabesp', days: 64, count: 9 },
      { name: 'Comgás', days: 58, count: 7 },
      { name: 'CPTM', days: 52, count: 5 },
      { name: 'Metrô', days: 45, count: 4 },
      { name: 'SPTrans', days: 41, count: 4 },
      { name: 'CDHU', days: 38, count: 3 },
      { name: 'CET', days: 35, count: 3 },
      { name: 'EMTU', days: 30, count: 2 },
      { name: 'Correios', days: 28, count: 2 }
    ];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Reduce days in simulation by ~40%
      return companies.map(company => ({
        ...company,
        days: Math.round(company.days * 0.6)
      }));
    }
    
    return companies;
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Top 10 Pendências Mais Antigas"
      subtitle="Empresas e Órgãos que não fecham OS"
      value="5 empresas concentram 30% dos casos"
      isLoading={isLoading}
    >
      {!isLoading && (
        <div className="w-full h-full overflow-y-auto p-1 text-sm">
          <div className="grid grid-cols-12 font-medium mb-2 text-gray-700 bg-gray-50 p-2 rounded">
            <div className="col-span-5">Empresa/Órgão</div>
            <div className="col-span-4 text-center">Tempo Médio</div>
            <div className="col-span-3 text-right">Qtde OS</div>
          </div>
          {generateOldestPendingData.map((item, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-12 py-1.5 px-2 ${index % 2 === 0 ? 'bg-blue-50' : ''}`}>
              <div className="col-span-5 font-medium text-gray-700">{item.name}</div>
              <div className="col-span-4 text-center text-blue-700">{item.days} dias</div>
              <div className="col-span-3 text-right text-gray-600">{item.count} OS</div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
};

export default OldestPendingList;
