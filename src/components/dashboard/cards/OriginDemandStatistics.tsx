
import React from 'react';
import { ArrowUp, ArrowDown, FileText, MessageSquare, FileSearch, Newspaper } from 'lucide-react';
import { format } from 'date-fns';

interface StatItem {
  title: string;
  count: number;
  previousCount: number;
  icon: React.ReactNode;
  iconColor: string;
}

const OriginDemandStatistics: React.FC = () => {
  // This would typically fetch from an API, but we're using mock data for now
  const stats: StatItem[] = [
    {
      title: 'Notícias',
      count: 12,
      previousCount: 8,
      icon: <Newspaper className="h-6 w-6" />,
      iconColor: 'text-blue-500'
    },
    {
      title: 'Releases',
      count: 5,
      previousCount: 7,
      icon: <FileText className="h-6 w-6" />,
      iconColor: 'text-green-500'
    },
    {
      title: 'Demandas',
      count: 23,
      previousCount: 19,
      icon: <MessageSquare className="h-6 w-6" />,
      iconColor: 'text-orange-500'
    },
    {
      title: 'Processos e-SIC',
      count: 8,
      previousCount: 10,
      icon: <FileSearch className="h-6 w-6" />,
      iconColor: 'text-purple-500'
    },
  ];
  
  const today = new Date();
  const formattedDate = format(today, 'dd/MM/yyyy');
  
  return (
    <div className="w-full h-full bg-gray-100 p-4 rounded-xl">
      <div className="flex justify-between mb-4 items-center">
        <h3 className="font-medium text-gray-800">Origem das Demandas</h3>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const percentChange = ((stat.count - stat.previousCount) / stat.previousCount) * 100;
          const isIncrease = percentChange > 0;
          
          return (
            <div 
              key={stat.title}
              className="bg-white p-3 rounded-lg shadow-sm flex flex-col"
            >
              <div className="flex items-center mb-2">
                <div className={`${stat.iconColor} mr-2`}>
                  {stat.icon}
                </div>
                <h4 className="text-sm font-medium text-gray-700">
                  {stat.title}
                </h4>
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-xl font-bold">{stat.count}</span>
                <div className={`flex items-center text-xs ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncrease ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(percentChange).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Ontem: {stat.previousCount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OriginDemandStatistics;
