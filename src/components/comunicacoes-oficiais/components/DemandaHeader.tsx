
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DemandaHeaderProps } from '../types';

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ 
  titulo, 
  status, 
  protocolo, 
  prioridade,
  horario_publicacao
}) => {
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberta': return 'default';
      case 'em_atendimento': return 'warning';
      case 'concluida': return 'success';
      case 'cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Badge variant={getBadgeVariant(status)}>
          {status.replace('_', ' ')}
        </Badge>
        
        {protocolo && (
          <Badge variant="outline" className="text-xs">
            Protocolo: {protocolo}
          </Badge>
        )}
        
        {prioridade && (
          <Badge variant={prioridade.toLowerCase() === 'alta' ? 'destructive' : 'secondary'} className="text-xs">
            Prioridade: {prioridade}
          </Badge>
        )}
      </div>
      
      <h1 className="text-2xl font-bold text-[#003570] mb-1">{titulo}</h1>
      
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        <span>
          Criado em: {format(new Date(horario_publicacao), 'dd MMM yyyy, HH:mm', { locale: ptBR })}
        </span>
      </div>
    </div>
  );
};

export default DemandaHeader;
