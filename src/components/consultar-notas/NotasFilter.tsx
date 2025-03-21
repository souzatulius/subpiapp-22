import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter, Calendar, FileText } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotasFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Buscar por título ou conteúdo..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
        <div className="flex items-center gap-2 flex-1">
          <Filter size={18} className="text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <FileText size={18} className="text-gray-500" />
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as áreas</SelectItem>
              <SelectItem value="comunicacao">Comunicação</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="cultura">Cultura</SelectItem>
              <SelectItem value="esportes">Esportes</SelectItem>
              <SelectItem value="zeladoria">Zeladoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] pl-3 flex items-center justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dataInicioFilter ? (
                  format(dataInicioFilter, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <span>Data inicial</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dataInicioFilter}
                onSelect={setDataInicioFilter}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] pl-3 flex items-center justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dataFimFilter ? (
                  format(dataFimFilter, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <span>Data final</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dataFimFilter}
                onSelect={setDataFimFilter}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" onClick={handleExportPDF}>
            <Download size={18} className="mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotasFilter;
