
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Demanda } from '../types';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';
import { calcularTempoRestante, getPriorityColor } from '@/utils/priorityUtils';

interface DemandaCardProps {
  demanda: Demanda;
  isSelected?: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, isSelected = false, onClick }) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Data não disponível';
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Calculate remaining time
  const tempoRestante = demanda.prazo_resposta 
    ? calcularTempoRestante(demanda.prazo_resposta) 
    : null;

  // Get priority color
  const priorityColors = getPriorityColor(demanda.prioridade);

  // Format title
  const title = demanda.titulo || 'Demanda sem título';
  const shortTitle = title.length > 60 ? `${title.substring(0, 60)}...` : title;

  // Origin name (safely accessing possibly undefined properties)
  const origemNome = demanda.origem_nome || 'Origem não especificada';

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-orange-500 shadow-md' : 'hover:border-orange-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm text-gray-700 font-medium">{shortTitle}</CardTitle>
          <Badge 
            variant="outline" 
            className={`${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} text-xs`}
          >
            {demanda.prioridade === 'alta' ? 'Alta' : 
              demanda.prioridade === 'media' ? 'Média' : 'Baixa'}
          </Badge>
        </div>
        <CardDescription className="text-xs mt-1">
          {origemNome}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="py-2 px-4">
        <div className="text-xs text-gray-600">
          <div className="flex items-center mb-1">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span>{demanda.bairro || 'Local não especificado'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-gray-400" />
            <span>Criada em: {formatDate(demanda.horario_publicacao)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="py-2 px-4 border-t border-gray-100">
        {tempoRestante && (
          <div className={tempoRestante.className}>
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs">{tempoRestante.label}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DemandaCard;
