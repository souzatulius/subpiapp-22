
import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="relative w-full md:w-80">
        <input
          type="text"
          placeholder="Buscar demandas..."
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Updated to rounded-xl
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <div className="flex border rounded-xl overflow-hidden bg-gray-50 mr-3"> {/* Updated to rounded-xl */}
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
          className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Updated to rounded-xl
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
