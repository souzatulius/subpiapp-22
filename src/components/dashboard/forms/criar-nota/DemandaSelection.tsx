
import React from 'react';
import { Demand } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DemandaStatusBadge } from '@/components/ui/status-badge';

interface DemandaSelectionProps {
  filteredDemandas: Demand[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDemandaSelect: (demandaId: string) => void;
  isLoading: boolean;
}

const DemandaSelection: React.FC<DemandaSelectionProps> = ({
  filteredDemandas,
  searchTerm,
  setSearchTerm,
  onDemandaSelect,
  isLoading
}) => {
  // Filter out demands without answers
  const demandasWithAnswers = filteredDemandas.filter(demand => {
    // Check if the demand has responses
    return demand.respostas && demand.respostas.length > 0;
  });
  
  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Selecione uma demanda</CardTitle>
        <p className="text-sm text-gray-500">
          Escolha uma demanda respondida para a qual deseja criar uma nota oficial
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Pesquisar demandas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : demandasWithAnswers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <p>Nenhuma demanda respondida encontrada para "{searchTerm}"</p>
              ) : (
                <p>Não há demandas respondidas disponíveis</p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {demandasWithAnswers.map((demanda) => (
                  <div
                    key={demanda.id}
                    onClick={() => onDemandaSelect(demanda.id)}
                    className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-blue-600">{demanda.titulo}</h3>
                        <DemandaStatusBadge status={demanda.status} size="sm" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        {demanda.area_coordenacao && (
                          <Badge variant="outline" className="bg-gray-100">
                            {demanda.area_coordenacao.descricao}
                          </Badge>
                        )}
                        
                        {demanda.prazo_resposta && (
                          <Badge variant="outline" className="bg-gray-100">
                            Prazo: {format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR })}
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className={`${demanda.prioridade === 'alta' ? 'bg-red-100 text-red-700' : demanda.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {demanda.prioridade === 'alta' ? 'Alta' : demanda.prioridade === 'media' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaSelection;
