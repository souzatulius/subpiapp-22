
import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarClock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Demanda } from '../types';
import { getPriorityColor } from '@/utils/priorityUtils';
import { DemandaStatusBadge } from '@/components/ui/status-badge';

interface DemandaCardProps {
  demanda: Demanda;
  isSelected: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, isSelected, onClick }) => {
  const priorityColors = getPriorityColor(demanda.prioridade);
  
  // Formatação correta da prioridade
  const formatarPrioridade = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return prioridade;
    }
  };
  
  // Extraindo a sigla da coordenação associada ao tema/problema
  const coordenacaoSigla = demanda.tema?.coordenacao?.sigla || 
                           demanda.problema?.coordenacao?.sigla || 
                           (demanda.coordenacao_id ? 'Coord.' : '');
  
  // Format relative time
  const relativeTime = demanda.horario_publicacao ? 
    formatDistanceToNow(new Date(demanda.horario_publicacao), { addSuffix: true, locale: ptBR }) : 
    'Data não disponível';

  // Format deadline with 2-digit year
  const prazoFormatado = demanda.prazo_resposta ? 
    format(new Date(demanda.prazo_resposta), "dd/MM/yy HH:mm", { locale: ptBR }) : 
    'Sem prazo definido';

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
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Badge 
              variant="outline" 
              className={`${priorityColors.bg} ${priorityColors.text} px-2.5 py-1`}
            >
              {formatarPrioridade(demanda.prioridade)}
            </Badge>
            
            <DemandaStatusBadge 
              status={demanda.status} 
              size="sm"
              className="px-2.5 py-1"
            />
            
            {coordenacaoSigla && (
              <Badge 
                className="bg-gray-100 text-gray-700 px-2.5 py-1"
              >
                {coordenacaoSigla}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="text-sm flex items-center text-gray-600 justify-between">
              <div className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4 flex-shrink-0" /> 
                {relativeTime}
              </div>
              {demanda.prazo_resposta && (
                <div className="text-xs text-orange-600 font-medium">
                  Prazo: {prazoFormatado}
                </div>
              )}
            </div>
          </div>
          
          {(demanda.endereco || (demanda.bairros && demanda.bairros.nome)) && (
            <div className="text-sm flex items-start text-gray-600">
              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">
                {demanda.endereco}{demanda.endereco && demanda.bairros?.nome ? ', ' : ''}
                {demanda.bairros?.nome}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaCard;
