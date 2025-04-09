
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DemandasSearchBar from '@/components/consultar-demandas/DemandasSearchBar';

interface DemandFilterProps {
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DemandFilter: React.FC<DemandFilterProps> = ({ 
  viewMode, 
  setViewMode, 
  filterStatus, 
  setFilterStatus,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <DemandasSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
      />
      
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <div className="flex border rounded-xl overflow-hidden bg-gray-50 mr-3">
          <Button
            variant="ghost"
            className={`px-4 py-2 ${viewMode === 'cards' ? 'bg-white text-blue-600' : 'bg-transparent'} transition-colors`}
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid size={18} className="mr-2" />
            Cards
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${viewMode === 'list' ? 'bg-white text-blue-600' : 'bg-transparent'} transition-colors`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} className="mr-2" />
            Lista
          </Button>
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="todos">Todas</option>
          <option value="pendente">Pendentes</option>
          <option value="respondida">Respondidas</option>
          <option value="aprovada">Aprovadas</option>
          <option value="recusada">Recusadas</option>
        </select>
      </div>
    </div>
  );
};

export default DemandFilter;
