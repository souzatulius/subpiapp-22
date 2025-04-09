
import React from 'react';
import { ChevronRight, Clock, Calendar, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Demand } from '@/types/demand';

interface DemandListProps {
  demandas: Demand[];
  isLoading: boolean;
  onSelectDemand: (demand: Demand) => void;
}

const DemandList: React.FC<DemandListProps> = ({ demandas, isLoading, onSelectDemand }) => {
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full">Pendente</Badge>;
      case 'respondida':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full">Respondida</Badge>;
      case 'aprovada':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">Aprovada</Badge>;
      case 'recusada':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 rounded-full">Recusada</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 rounded-full">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="border rounded-xl overflow-hidden mt-4"> {/* Updated to rounded-xl */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex items-center p-4 ${i !== 4 ? 'border-b' : ''}`}>
            <div className="flex-grow">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="w-24 flex justify-center">
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="w-28">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="w-12 flex justify-center">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="border rounded-xl overflow-hidden mt-4"> {/* Updated to rounded-xl */}
      {demandas.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Nenhuma demanda encontrada.
        </div>
      ) : (
        demandas.map((demand, index) => (
          <div 
            key={demand.id}
            className={`flex flex-col md:flex-row md:items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              index !== demandas.length - 1 ? 'border-b' : ''
            }`}
            onClick={() => onSelectDemand(demand)}
          >
            <div className="flex-grow mb-2 md:mb-0">
              <h3 className="font-medium text-gray-800">{demand.title}</h3>
              <p className="text-sm text-gray-500">{demand.origem}</p>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock size={14} />
                <span>{demand.urgente ? 'Urgente' : 'Normal'}</span>
              </div>
              <div className="w-28">
                {getStatusBadge(demand.status)}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                <span>{demand.dataCriacao}</span>
              </div>
              <div className="flex items-center justify-center w-8">
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DemandList;
