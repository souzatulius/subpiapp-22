
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemandaHeaderProps {
  demanda: {
    titulo: string;
    horario_publicacao: string;
    prioridade: string;
  };
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ demanda }) => {
  // Updated to use orange for "alta" priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return {
          text: 'text-orange-700',
          bg: 'bg-orange-50',
          border: 'border-orange-200'
        };
      case 'media':
        return {
          text: 'text-yellow-700',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200'
        };
      case 'baixa':
      default:
        return {
          text: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-200'
        };
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return priority.charAt(0).toUpperCase() + priority.slice(1);
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
        className={`${getPriorityColor(demanda.prioridade).text} ${getPriorityColor(demanda.prioridade).bg} ${getPriorityColor(demanda.prioridade).border} px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300`}
      >
        Prioridade: {getPriorityText(demanda.prioridade)}
      </Badge>
    </div>
  );
};

export default DemandaHeader;
