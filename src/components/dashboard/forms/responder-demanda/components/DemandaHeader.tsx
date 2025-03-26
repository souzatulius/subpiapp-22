
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Demanda } from '../types';

interface DemandaHeaderProps {
  demanda: Demanda;
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ demanda }) => {
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityText = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      default: return 'Baixa';
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle>{demanda.titulo}</CardTitle>
        <CardDescription>
          Criada em: {format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
        </CardDescription>
      </div>
      <Badge 
        variant="outline" 
        className={getPriorityColor(demanda.prioridade)}
      >
        Prioridade: {getPriorityText(demanda.prioridade)}
      </Badge>
    </div>
  );
};

export default DemandaHeader;
