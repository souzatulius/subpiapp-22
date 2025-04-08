
import React, { useState } from 'react';
import { Search, Filter, FileText, LayoutGrid, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import ProcessoItem from './ProcessoItem';
import ProcessoCard from './ProcessoCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ProcessoListProps {
  processos: ESICProcesso[] | undefined;
  isLoading: boolean;
  onSelectProcesso: (processo: ESICProcesso) => void;
  onEditProcesso: (processo: ESICProcesso) => void;
  onDeleteProcesso: (id: string) => void;
}

const ProcessoList: React.FC<ProcessoListProps> = ({ 
  processos, 
  isLoading, 
  onSelectProcesso,
  onEditProcesso,
  onDeleteProcesso
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [situacaoFilter, setSituacaoFilter] = useState('todos');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Filter and search logic
  const filteredProcessos = processos?.filter(processo => {
    // Text search
    const searchMatches = processo.texto.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatches = statusFilter === 'todos' || processo.status === statusFilter;
    
    // Situacao filter
    const situacaoMatches = situacaoFilter === 'todos' || processo.situacao === situacaoFilter;
    
    return searchMatches && statusMatches && situacaoMatches;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar nos processos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'grid')}>
            <ToggleGroupItem value="list" aria-label="Visualizar em lista" className="h-9 w-9 p-0">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Visualizar em cards" className="h-9 w-9 p-0">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="h-9 w-[160px] min-w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={situacaoFilter} 
            onValueChange={setSituacaoFilter}
          >
            <SelectTrigger className="h-9 w-[160px] min-w-[120px]">
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as situações</SelectItem>
              {Object.entries(situacaoLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {(searchTerm || statusFilter !== 'todos' || situacaoFilter !== 'todos') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setSituacaoFilter('todos');
              }}
              className="h-9"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : filteredProcessos && filteredProcessos.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredProcessos.map((processo) => (
              <ProcessoItem
                key={processo.id}
                processo={processo}
                onSelect={onSelectProcesso}
                onEdit={onEditProcesso}
                onDelete={onDeleteProcesso}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProcessos.map((processo) => (
              <ProcessoCard
                key={processo.id}
                processo={processo}
                onSelect={onSelectProcesso}
                onEdit={onEditProcesso}
                onDelete={onDeleteProcesso}
              />
            ))}
          </div>
        )
      ) : (
        <Card className="p-8 text-center bg-gray-50">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            {searchTerm || statusFilter !== 'todos' || situacaoFilter !== 'todos' 
              ? 'Nenhum processo encontrado com os filtros aplicados' 
              : 'Nenhum processo encontrado'}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'todos' || situacaoFilter !== 'todos' 
              ? 'Tente ajustar os filtros de busca' 
              : 'Comece criando um novo processo'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default ProcessoList;
