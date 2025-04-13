
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, FileText, Inbox, Newspaper, FileCog } from 'lucide-react';

interface KpiItem {
  title: string;
  value: number;
  previousValue: number;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
}

const OriginDemandStatistics: React.FC = () => {
  // Enhanced mock data - would be replaced with real API data
  const kpis: KpiItem[] = [
    {
      title: 'Notícias',
      value: 25,
      previousValue: 20,
      change: 25,
      isPositive: true,
      icon: <Newspaper className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Releases',
      value: 12,
      previousValue: 15,
      change: 20,
      isPositive: false,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    {
      title: 'Demandas',
      value: 34,
      previousValue: 28,
      change: 21,
      isPositive: true,
      icon: <Inbox className="h-5 w-5 text-orange-500" />
    },
    {
      title: 'Notas',
      value: 8,
      previousValue: 10,
      change: 20,
      isPositive: false,
      icon: <FileText className="h-5 w-5 text-purple-500" />
    },
    {
      title: 'e-SIC',
      value: 15,
      previousValue: 12,
      change: 25,
      isPositive: true,
      icon: <FileCog className="h-5 w-5 text-indigo-500" />
    }
  ];
  
  return (
    <div className="w-full h-full p-4 bg-gray-50">
      <h3 className="text-base font-medium mb-4 text-gray-800">Estatísticas de Conteúdo</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div className="bg-gray-100 p-2 rounded-full">
                {kpi.icon}
              </div>
              
              <div className="flex items-center text-xs">
                <span className={kpi.isPositive ? 'text-green-500' : 'text-red-500'}>
                  {kpi.isPositive ? (
                    <ArrowUpIcon className="h-3 w-3 inline mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 inline mr-1" />
                  )}
                  {kpi.change}%
                </span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-xs text-gray-500">{kpi.title}</p>
              <p className="text-xl font-semibold">{kpi.value}</p>
              <p className="text-xs text-gray-400">Ontem: {kpi.previousValue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OriginDemandStatistics;
