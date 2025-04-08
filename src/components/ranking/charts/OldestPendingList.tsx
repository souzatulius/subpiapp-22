
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
  // Generate oldest pending items
  const generateOldestPendingData = React.useMemo(() => {
    const companies = [
      'Enel', 
      'Sabesp', 
      'Comgás', 
      'SPTrans', 
      'CESP',
      'CPTM',
      'CDHU',
      'Embasa',
      'CBTU',
      'Metrô'
    ];
    
    // Generate days pending for each company
    let daysPending = isSimulationActive ?
      [45, 42, 38, 35, 32, 30, 28, 25, 22, 20] :
      [90, 85, 78, 72, 68, 65, 60, 58, 52, 48];
    
    return companies.map((company, index) => ({
      company,
      days: daysPending[index],
      protocol: `${Math.floor(Math.random() * 900000) + 100000}/2023`,
      service: ['Iluminação', 'Buracos', 'Poda', 'Bueiros', 'Lixo'][index % 5]
    }));
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Top 10 Pendências Mais Antigas"
      subtitle="Empresas e Órgãos que não fecham OS"
      value="5 empresas concentram 30% dos casos"
      isLoading={isLoading}
    >
      {!isLoading && (
        <div className="h-full overflow-y-auto pr-2">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-700 border-b border-gray-200">
              <tr>
                <th className="py-2 text-left">Empresa</th>
                <th className="py-2 text-left">Dias</th>
                <th className="py-2 text-left hidden sm:table-cell">Protocolo</th>
                <th className="py-2 text-left hidden md:table-cell">Serviço</th>
              </tr>
            </thead>
            <tbody>
              {generateOldestPendingData.map((item, i) => (
                <tr 
                  key={i} 
                  className={`border-b border-gray-100 ${i < 3 ? 'bg-orange-50' : ''}`}
                >
                  <td className="py-2 font-medium">
                    {item.company}
                  </td>
                  <td className="py-2 text-orange-600 font-medium">
                    {item.days}
                  </td>
                  <td className="py-2 text-gray-500 hidden sm:table-cell">
                    {item.protocol}
                  </td>
                  <td className="py-2 text-gray-700 hidden md:table-cell">
                    {item.service}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
};

export default OldestPendingList;
