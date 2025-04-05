
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Demanda } from '../types';
import { getPriorityColor, formatPriority } from '@/utils/priorityUtils';

interface DemandaHeaderProps {
  demanda: Demanda;
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ demanda }) => {
  const priorityColors = getPriorityColor(demanda.prioridade);
  const priorityText = formatPriority(demanda.prioridade);

  const dataCriacao = demanda.horario_publicacao
    ? format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })
    : 'Data não disponível';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-2 transition-all duration-300 animate-fade-in">
      <div>
        <CardTitle className="text-lg text-subpi-blue mb-1">{demanda.titulo || 'Sem título definido'}</CardTitle>
        <CardDescription className="text-gray-600">
          Criada em: <span className="font-medium">{dataCriacao}</span>
        </CardDescription>
      </div>
      <Badge 
        variant="outline" 
        className={`${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300`}
      >
        Prioridade: {priorityText}
      </Badge>
    </div>
  );
};

export default DemandaHeader;
