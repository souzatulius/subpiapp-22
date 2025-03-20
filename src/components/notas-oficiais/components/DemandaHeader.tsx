
import React from 'react';
import { ChevronLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../types';

interface DemandaHeaderProps {
  titulo: string;
  status: string;
  protocolo?: string;
  prioridade?: string;
  horario_publicacao?: string;
  onClose?: () => void;
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ 
  titulo, 
  status, 
  protocolo, 
  prioridade,
  horario_publicacao,
  onClose 
}) => {
  const formattedDate = horario_publicacao 
    ? format(new Date(horario_publicacao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : 'Data não disponível';
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex gap-3">
          {protocolo && (
            <Badge variant="outline" className="bg-slate-100">
              {protocolo}
            </Badge>
          )}
          <Badge variant="outline" className={
            status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
            status === 'concluído' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }>
            {status}
          </Badge>
          {prioridade && (
            <Badge variant="outline" className={
              prioridade === 'alta' ? 'bg-red-100 text-red-800' :
              prioridade === 'media' ? 'bg-orange-100 text-orange-800' : 
              'bg-green-100 text-green-800'
            }>
              {prioridade === 'alta' ? 'Alta' : 
               prioridade === 'media' ? 'Média' : 'Baixa'}
            </Badge>
          )}
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold">{titulo}</h2>
      
      {horario_publicacao && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      )}
      
      <Separator />
    </div>
  );
};

export default DemandaHeader;
