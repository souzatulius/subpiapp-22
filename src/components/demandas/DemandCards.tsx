
import React from 'react';
import { Clock, Calendar, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Demand } from '@/types/demand';

interface DemandCardsProps {
  demandas: Demand[];
  isLoading: boolean;
  onSelectDemand: (demand: Demand) => void;
}

const DemandCards: React.FC<DemandCardsProps> = ({ demandas, isLoading, onSelectDemand }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-xl"> {/* Updated to rounded-xl */}
            <CardContent className="p-0">
              <div className="p-5 border-b">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {demandas.map((demand) => (
        <Card 
          key={demand.id} 
          className="cursor-pointer overflow-hidden hover:shadow-md transition-shadow rounded-xl" // Updated to rounded-xl
          onClick={() => onSelectDemand(demand)}
        >
          <CardContent className="p-0">
            <div className="p-5 border-b">
              <h3 className="text-lg font-medium text-gray-800 mb-1">{demand.title}</h3>
              <p className="text-sm text-gray-500">{demand.origem}</p>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{demand.urgente ? 'Urgente' : 'Normal'}</span>
                </div>
                {getStatusBadge(demand.status)}
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Criada: {demand.dataCriacao}</span>
                </div>
                {demand.dataResposta && (
                  <div className="flex items-center gap-1">
                    <Check size={12} />
                    <span>Respondida: {demand.dataResposta}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DemandCards;
