
import React from 'react';
import { CalendarClock, Info } from 'lucide-react';
import { formatarData } from '../utils/formatters';
import { Demanda } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemandaCardProps {
  demanda: Demanda;
  selected: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, selected, onClick }) => {
  // Define badge color based on priority
  const getPriorityBadge = () => {
    switch (demanda.prioridade.toLowerCase()) {
      case 'alta':
        return 'bg-red-500 hover:bg-red-600';
      case 'media':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'baixa':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Format date for display
  const formattedDate = formatarData(demanda.prazo_resposta);
  
  return (
    <Card 
      className={`transition-all cursor-pointer ${
        selected 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'hover:bg-gray-50 border border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium line-clamp-2">{demanda.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Info className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{demanda.problema?.descricao || 'Não informada'}</span>
          </div>
          <Badge className={`text-xs ${getPriorityBadge()}`}>
            {demanda.prioridade.charAt(0).toUpperCase() + demanda.prioridade.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <CalendarClock className="w-4 h-4 mr-1" />
          <span>Prazo: {formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaCard;
