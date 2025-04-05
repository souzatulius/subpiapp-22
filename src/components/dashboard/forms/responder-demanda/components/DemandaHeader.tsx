
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Demanda } from '../types';

interface DemandaHeaderProps {
  demanda: Demanda;
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ demanda }) => {
  const getPriorityText = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Normal';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
        className={`${getPriorityColor(demanda.prioridade)} px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300`}
      >
        Prioridade: {getPriorityText(demanda.prioridade)}
      </Badge>
    </div>
  );
};

export default DemandaHeader;
