
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../types';
import { Badge } from '@/components/ui/badge';
import { calcularTempoRestante } from '@/utils/priorityUtils';

interface DemandaCardProps {
  demanda: Demanda;
  isSelected: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, isSelected, onClick }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definido';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
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

  const getPriorityText = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Normal';
    }
  };

  const tempoRestante = calcularTempoRestante(demanda.prazo_resposta);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <Badge 
            variant="outline" 
            className={getPriorityColor(demanda.prioridade)}
          >
            {getPriorityText(demanda.prioridade)}
          </Badge>
          
          {demanda.tema?.descricao && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {demanda.tema.descricao}
            </Badge>
          )}
        </div>
        
        <h3 className="font-medium text-gray-900 line-clamp-2">{demanda.titulo}</h3>
        
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(demanda.horario_publicacao)}</span>
        </div>
        
        {demanda.prazo_resposta && tempoRestante && (
          <div className={`flex items-center text-sm gap-1 ${tempoRestante.className}`}>
            <Clock className="h-4 w-4" />
            <span>{tempoRestante.label}</span>
          </div>
        )}
        
        {demanda.origem?.descricao && (
          <div className="text-sm text-gray-500">
            Origem: <span className="font-medium">{demanda.origem.descricao}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemandaCard;
