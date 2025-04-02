
import React from 'react';
import { Search, Download, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface NotasFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  areaFilter: string;
  setAreaFilter: (value: string) => void;
  dataInicioFilter: Date | undefined;
  setDataInicioFilter: (date: Date | undefined) => void;
  dataFimFilter: Date | undefined;
  setDataFimFilter: (date: Date | undefined) => void;
  handleExportPDF: () => void;
}

const NotasFilter: React.FC<NotasFilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  areaFilter,
  setAreaFilter,
  dataInicioFilter,
  setDataInicioFilter,
  dataFimFilter,
  setDataFimFilter,
  handleExportPDF
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por título, autor ou área..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
            </SelectContent>
          </Select>
          
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
          
          <Button 
            onClick={handleExportPDF} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
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
      </div>
    </div>
  );
};

export default NotasFilter;
