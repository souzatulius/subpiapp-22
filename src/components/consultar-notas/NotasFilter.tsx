
import React from 'react';
import { Search, Download, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface NotasFilterProps {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  areaFilter?: string;
  setAreaFilter?: (value: string) => void;
  dataInicioFilter?: Date | undefined;
  setDataInicioFilter?: (date: Date | undefined) => void;
  dataFimFilter?: Date | undefined;
  setDataFimFilter?: (date: Date | undefined) => void;
  dateRange?: [Date | null, Date | null];
  setDateRange?: (range: [Date | null, Date | null]) => void;
  viewMode?: 'table' | 'cards';
  setViewMode?: (mode: 'table' | 'cards') => void;
  handleExportPDF?: () => void;
}

const NotasFilter: React.FC<NotasFilterProps> = ({
  searchQuery = '',
  setSearchQuery = () => {},
  searchTerm = '',
  setSearchTerm = () => {},
  statusFilter,
  setStatusFilter,
  areaFilter = 'all',
  setAreaFilter = () => {},
  dataInicioFilter,
  setDataInicioFilter = () => {},
  dataFimFilter,
  setDataFimFilter = () => {},
  dateRange = [null, null],
  setDateRange = () => {},
  viewMode,
  setViewMode,
  handleExportPDF = () => {}
}) => {
  // Use either searchQuery or searchTerm based on what's provided
  const actualSearchTerm = searchQuery || searchTerm;
  const handleSearchChange = (value: string) => {
    if (setSearchQuery) setSearchQuery(value);
    if (setSearchTerm) setSearchTerm(value);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por título, autor ou área..."
            value={actualSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
            </SelectContent>
          </Select>
          
          {setAreaFilter && (
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="comunicacao">Comunicação</SelectItem>
                <SelectItem value="areas_verdes">Áreas Verdes</SelectItem>
                <SelectItem value="manutencao_viaria">Manutenção Viária</SelectItem>
                <SelectItem value="fiscalizacao">Fiscalização</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button 
            onClick={handleExportPDF} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>

          {viewMode && setViewMode && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Tabela
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Date filters - either use dateRange or individual date filters */}
      {(setDateRange || setDataInicioFilter || setDataFimFilter) && (
        <div className="flex flex-wrap gap-3 items-center">
          {setDateRange && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">De:</span>
                <DatePicker 
                  date={dateRange[0]} 
                  onSelect={(date) => setDateRange([date, dateRange[1]])}
                  placeholder="Selecione"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Até:</span>
                <DatePicker 
                  date={dateRange[1]} 
                  onSelect={(date) => setDateRange([dateRange[0], date])}
                  placeholder="Selecione"
                />
              </div>
            </>
          )}
          
          {(setDataInicioFilter || setDataFimFilter) && !setDateRange && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">De:</span>
                <DatePicker 
                  date={dataInicioFilter} 
                  onSelect={setDataInicioFilter}
                  placeholder="Selecione"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Até:</span>
                <DatePicker 
                  date={dataFimFilter} 
                  onSelect={setDataFimFilter}
                  placeholder="Selecione"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotasFilter;
