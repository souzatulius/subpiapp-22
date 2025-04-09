
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Demand } from '@/hooks/consultar-demandas/types';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { formatPriority, getPriorityColor } from '@/utils/priorityUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Clock, Calendar } from 'lucide-react';

interface DemandaCardsProps {
  demandas: Demand[];
  isLoading: boolean;
  onSelectDemand: (demand: Demand) => void;
}

const DemandaCards: React.FC<DemandaCardsProps> = ({ demandas, isLoading, onSelectDemand }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-white border rounded-xl shadow-sm animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded-xl w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-full mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-xl w-16"></div>
                <div className="h-6 bg-gray-200 rounded-xl w-20"></div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 rounded-b-xl px-6 py-3 border-t">
              <div className="h-4 bg-gray-200 rounded-xl w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-xl">
        <h3 className="text-lg font-medium mb-2">Nenhuma demanda encontrada</h3>
        <p className="text-gray-500">Não há demandas com os filtros selecionados.</p>
      </div>
    );
  }

  const getPriorityBadgeClasses = (prioridade: string) => {
    const colors = getPriorityColor(prioridade);
    return `${colors.bg} ${colors.text} border ${colors.border} rounded-full`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demandas.map((demanda) => {
        const hasNota = demanda.notas && demanda.notas.length > 0;
        const coordenacaoDescricao = demanda.problema?.coordenacao?.descricao || 
                                    demanda.area_coordenacao?.descricao || 
                                    'Não informada';
        
        return (
          <Card 
            key={demanda.id} 
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelectDemand(demanda)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-2 text-subpi-blue">{demanda.titulo}</h3>
                {hasNota && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 ml-2 rounded-full">
                    <FileText className="h-3 w-3 mr-1" /> 
                    Nota
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {coordenacaoDescricao}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={getPriorityBadgeClasses(demanda.prioridade)}>
                  {formatPriority(demanda.prioridade)}
                </Badge>
                
                <DemandaStatusBadge status={demanda.status} size="sm" />
              </div>
              
              <div className="text-xs text-gray-500 flex flex-col gap-1">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="font-medium">Origem:</span> {demanda.origem?.descricao || 'Não especificado'}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="font-medium">Prazo:</span> {demanda.prazo_resposta ? 
                    format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'Sem prazo definido'
                  }
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 px-6 py-3 border-t rounded-b-xl">
              <div className="text-xs text-gray-500 w-full">
                <span className="font-medium">Responsável:</span> {demanda.autor?.nome_completo || 'Não atribuído'}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default DemandaCards;
