
import React from 'react';
import { Grid2X2, List, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface DemandFilterProps {
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const DemandFilter: React.FC<DemandFilterProps> = ({ 
  viewMode, 
  setViewMode, 
  filterStatus, 
  setFilterStatus 
}) => {
  const navigate = useNavigate();

  const handleCreateDemand = () => {
    // TODO: Implement navigation to create demand form
    // For now, we'll just alert
    alert('Função para criar demanda será implementada em breve!');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluida">Concluídas</SelectItem>
            <SelectItem value="arquivada">Arquivadas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <div className="border rounded-md overflow-hidden flex">
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'ghost'} 
            size="sm" 
            className="rounded-none"
            onClick={() => setViewMode('cards')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            className="rounded-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="action" size="sm" onClick={handleCreateDemand}>
          <Plus className="h-4 w-4" />
          Nova Demanda
        </Button>
      </div>
    </div>
  );
};

export default DemandFilter;
