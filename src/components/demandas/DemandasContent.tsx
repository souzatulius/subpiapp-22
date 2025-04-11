
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandDetail from './DemandDetail';
import { useDemandas } from '@/hooks/demandas/useDemandas';
import UnifiedViewContainer from '@/components/shared/unified-view/UnifiedViewContainer';
import { Demand } from '@/types/demand';

const DemandasContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('pendente');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const {
    demandas: fetchedDemandas,
    isLoading,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail
  } = useDemandas(filterStatus);

  // Filter demands by search term
  const filteredDemandas = fetchedDemandas.filter(demand => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      (demand.title?.toLowerCase().includes(term)) ||
      (demand.origem?.toLowerCase().includes(term)) ||
      (demand.status?.toLowerCase().includes(term))
    );
  });

  useEffect(() => {
    console.log("Demandas atualizadas:", fetchedDemandas);
  }, [fetchedDemandas]);

  const statusOptions = [
    { id: 'todos', label: 'Todas' },
    { id: 'pendente', label: 'Pendentes' },
    { id: 'respondida', label: 'Respondidas' },
    { id: 'aprovada', label: 'Aprovadas' },
    { id: 'recusada', label: 'Recusadas' }
  ];

  const renderDemandCard = (demand: Demand) => {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{demand.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            demand.status === 'aprovada' ? 'bg-green-100 text-green-800' : 
            demand.status === 'recusada' ? 'bg-red-100 text-red-800' :
            demand.status === 'respondida' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {demand.status}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p>Origem: {demand.origem || 'Não especificada'}</p>
          <p>Data: {demand.data || 'Não especificada'}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm rounded-xl">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-2xl font-bold text-[#003570]">
          Gerenciamento de Demandas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <UnifiedViewContainer
          items={filteredDemandas}
          isLoading={isLoading}
          renderListItem={renderDemandCard}
          renderGridItem={renderDemandCard}
          idExtractor={(demand) => demand.id || ''}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onItemClick={handleSelectDemand}
          selectedItemId={selectedDemand?.id}
          filterOptions={{
            primaryFilter: {
              value: filterStatus,
              onChange: setFilterStatus,
              options: statusOptions,
              placeholder: 'Status'
            }
          }}
          emptyStateMessage="Nenhuma demanda encontrada"
          searchPlaceholder="Buscar demandas..."
          defaultViewMode={viewMode}
        />

        <DemandDetail demand={selectedDemand} isOpen={isDetailOpen} onClose={handleCloseDetail} />
      </CardContent>
    </Card>
  );
};

export default DemandasContent;
