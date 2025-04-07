
import React, { useState } from 'react';
import { Search, Filter, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import ProcessoItem from './ProcessoItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar nos processos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por situação" />
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
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setSituacaoFilter('todos');
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : filteredProcessos && filteredProcessos.length > 0 ? (
        <div className="space-y-4">
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
        <Card className="p-12 text-center bg-gray-50">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            {searchTerm || statusFilter !== 'todos' || situacaoFilter !== 'todos' 
              ? 'Nenhum processo encontrado com os filtros aplicados' 
              : 'Nenhum processo do e-SIC encontrado'}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'todos' || situacaoFilter !== 'todos' 
              ? 'Tente ajustar os filtros de busca' 
              : 'Comece criando um novo processo no sistema'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default ProcessoList;
