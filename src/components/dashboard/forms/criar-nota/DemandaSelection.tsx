
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demand } from './types';
import { Loader2, Clock, Calendar, FileText, MapPin, Building, Tag } from 'lucide-react';
import UnifiedFilterBar, { ViewMode } from '@/components/shared/unified-view/UnifiedFilterBar';
import { PrioridadeBadge } from '@/components/ui/badges/prioridade-badge';
import { TemaBadge } from '@/components/ui/badges/tema-badge';
import { CoordenacaoBadge } from '@/components/ui/badges/coordenacao-badge';
import { formatDateWithTime } from '@/lib/dateUtils';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  return (
    <Card className="border border-gray-200 rounded-xl shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <UnifiedFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchPlaceholder="Buscar demanda por título..."
          />
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className={`mt-4 ${viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'} max-h-96 overflow-y-auto`}>
              {filteredDemandas.length > 0 ? (
                filteredDemandas.map((demanda) => (
                  <div 
                    key={demanda.id}
                    className={`p-3 border rounded-xl hover:bg-gray-50 cursor-pointer ${viewMode === 'cards' ? 'h-full' : ''}`}
                    onClick={() => onDemandaSelect(demanda.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{demanda.titulo}</div>
                      <div>
                        {demanda.prioridade && (
                          <PrioridadeBadge prioridade={demanda.prioridade} size="xs" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {demanda.problema?.descricao && (
                        <TemaBadge texto={demanda.problema.descricao} size="xs" />
                      )}
                      {demanda.coordenacao && (demanda.coordenacao.sigla || demanda.coordenacao.descricao) && (
                        <CoordenacaoBadge 
                          texto={
                            demanda.coordenacao.sigla || 
                            demanda.coordenacao.descricao || 
                            'Coordenação'
                          } 
                          size="xs" 
                        />
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 flex flex-col gap-1">
                      {demanda.horario_publicacao && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Criado em: {formatDateWithTime(demanda.horario_publicacao)}</span>
                        </div>
                      )}
                      
                      {demanda.prazo_resposta && (
                        <div className="flex items-center text-orange-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Prazo: {formatDateWithTime(demanda.prazo_resposta)}</span>
                        </div>
                      )}
                      
                      {demanda.servico?.descricao && (
                        <div className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          <span>Serviço: {demanda.servico.descricao}</span>
                        </div>
                      )}
                      
                      {demanda.bairros?.nome && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Bairro: {demanda.bairros.nome}</span>
                        </div>
                      )}
                      
                      {demanda.origem?.descricao && (
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span>Origem: {demanda.origem.descricao}</span>
                        </div>
                      )}
                      
                      {demanda.protocolo && (
                        <div className="flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          <span>Protocolo: {demanda.protocolo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 rounded-xl border border-gray-200">
                  Nenhuma demanda disponível para criar nota encontrada
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaSelection;
