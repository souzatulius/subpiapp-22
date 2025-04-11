
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Edit, MessageSquare, FileText, Check, Trash2, Eye } from 'lucide-react';
import DemandDetail from './DemandDetail';
import { useDemandas } from '@/hooks/demandas/useDemandas';
import UnifiedViewContainer from '@/components/shared/unified-view/UnifiedViewContainer';
import { Demand } from '@/types/demand';
import LabelBadge from '@/components/ui/label-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DemandasContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const {
    demandas: fetchedDemandas,
    isLoading,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail,
    refetch
  } = useDemandas(filterStatus === 'todos' ? undefined : filterStatus);

  // Filter demands by search term
  const filteredDemandas = fetchedDemandas.filter(demand => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      (demand.title?.toLowerCase().includes(term)) || 
      (demand.titulo?.toLowerCase().includes(term)) ||
      (demand.origem?.toLowerCase().includes(term)) ||
      (demand.problema?.descricao?.toLowerCase().includes(term)) ||
      (demand.status?.toLowerCase().includes(term))
    );
  });

  useEffect(() => {
    console.log("Demandas atualizadas:", fetchedDemandas);
  }, [fetchedDemandas]);

  const statusOptions = [
    { id: 'todos', label: 'Todos Status' },
    { id: 'pendente', label: 'Pendentes' },
    { id: 'em_analise', label: 'Em Análise' },
    { id: 'respondida', label: 'Respondidas' },
    { id: 'aguardando_nota', label: 'Aguardando Nota' },
    { id: 'aguardando_aprovacao', label: 'Em Aprovação' },
    { id: 'concluida', label: 'Finalizadas' }
  ];

  const handleViewDemand = (demand: Demand) => {
    handleSelectDemand(demand);
  };

  const handleEditDemand = (demand: Demand) => {
    // Will be implemented later
    console.log("Edit demand:", demand.id);
  };

  const handleRespondDemand = (demand: Demand) => {
    // Will be implemented later
    console.log("Respond to demand:", demand.id);
  };

  const handleCreateNote = (demand: Demand) => {
    // Will be implemented later
    console.log("Create note for demand:", demand.id);
  };

  const handleApproveNote = (demand: Demand) => {
    // Will be implemented later
    console.log("Approve note for demand:", demand.id);
  };

  const handleDeleteDemand = (demand: Demand) => {
    // Will be implemented later
    console.log("Delete demand:", demand.id);
  };

  const renderDemandCard = (demand: Demand) => {
    const hasNotes = demand.notas && demand.notas.length > 0;
    
    return (
      <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium mb-1">{demand.title || demand.titulo}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <LabelBadge 
                label="Status" 
                value={demand.status} 
                variant="status" 
                size="sm"
              />
              {demand.prioridade && (
                <LabelBadge 
                  label="Prioridade" 
                  value={demand.prioridade} 
                  variant="priority" 
                  size="sm"
                />
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => handleViewDemand(demand)} className="rounded-lg cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                <span>Visualizar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditDemand(demand)} className="rounded-lg cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRespondDemand(demand)} className="rounded-lg cursor-pointer">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Responder</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateNote(demand)} className="rounded-lg cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Criar Nota</span>
              </DropdownMenuItem>
              {hasNotes && (
                <DropdownMenuItem onClick={() => handleApproveNote(demand)} className="rounded-lg cursor-pointer">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Aprovar Nota</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleDeleteDemand(demand)} className="rounded-lg cursor-pointer text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center">
            <span className="font-medium mr-1">Origem:</span> 
            {demand.origem || demand.origem_id || 'Não especificada'}
          </p>
          {demand.horario_publicacao && (
            <p>
              <span className="font-medium mr-1">Data:</span>
              {format(new Date(demand.horario_publicacao), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          )}
          {demand.problema?.descricao && (
            <p>
              <span className="font-medium mr-1">Problema:</span>
              {demand.problema.descricao}
            </p>
          )}
          {hasNotes && (
            <p className="text-blue-600 font-medium">
              {demand.notas.length} {demand.notas.length === 1 ? 'nota vinculada' : 'notas vinculadas'}
            </p>
          )}
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
          onItemClick={handleViewDemand}
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
