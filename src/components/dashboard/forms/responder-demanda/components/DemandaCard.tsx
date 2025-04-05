
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarClock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Demanda } from '../types';
import { getPriorityColor } from '@/utils/priorityUtils';

interface DemandaCardProps {
  demanda: Demanda;
  isSelected: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, isSelected, onClick }) => {
  const priorityColors = getPriorityColor(demanda.prioridade);
  
  // Calculate days past deadline
  const daysPastDeadline = demanda.prazo_atendimento ? 
    Math.ceil((new Date().getTime() - new Date(demanda.prazo_atendimento).getTime()) / (1000 * 3600 * 24)) : 
    null;
  
  // Determine if the deadline is in the past
  const isOverdue = daysPastDeadline && daysPastDeadline > 0;
  
  // Format relative time
  const relativeTime = demanda.criado_em ? 
    formatDistanceToNow(new Date(demanda.criado_em), { addSuffix: true, locale: ptBR }) : 
    'Data não disponível';

  return (
    <Card 
      className={`border transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected 
          ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50' 
          : 'border-gray-200 hover:border-orange-300'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 line-clamp-2">{demanda.titulo || "Sem título"}</h3>
            <Badge 
              variant="outline" 
              className={`${priorityColors.bg} ${priorityColors.text} whitespace-nowrap ml-2`}
            >
              {demanda.prioridade}
            </Badge>
          </div>
          
          <div className="text-sm flex items-center text-gray-600">
            <CalendarClock className="h-4 w-4 mr-1 flex-shrink-0" /> 
            {relativeTime}
            {isOverdue && (
              <span className="ml-2 text-blue-600 font-medium">
                Vence há {daysPastDeadline} dia{daysPastDeadline > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {demanda.origem && (
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {demanda.origem}
              </Badge>
            </div>
          )}
          
          {(demanda.endereco || demanda.bairro_nome) && (
            <div className="text-sm flex items-start text-gray-600">
              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">
                {demanda.endereco}{demanda.endereco && demanda.bairro_nome ? ', ' : ''}
                {demanda.bairro_nome}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaCard;
