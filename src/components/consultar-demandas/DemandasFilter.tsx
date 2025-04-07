
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Search } from 'lucide-react';

interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  coordination: string;
  setCoordination: (coordination: string) => void;
  tema: string;
  setTema: (tema: string) => void;
  status: string;
  setStatus: (status: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DemandasFilter: React.FC<DemandasFilterProps> = ({
  searchTerm,
  setSearchTerm,
  coordination,
  setCoordination,
  tema,
  setTema,
  status,
  setStatus,
  dateRange,
  setDateRange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Label htmlFor="search" className="mb-2 block text-sm font-medium">
            Pesquisar
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Buscar por título ou área..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="coordination" className="mb-2 block text-sm font-medium">
            Coordenação
          </Label>
          <Select value={coordination} onValueChange={setCoordination}>
            <SelectTrigger id="coordination">
              <SelectValue placeholder="Selecione uma coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as coordenações</SelectItem>
              <SelectItem value="stm">Supervisão Técnica de Manutenção</SelectItem>
              <SelectItem value="stlp">Supervisão Técnica de Limpeza Pública</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tema" className="mb-2 block text-sm font-medium">
            Tema
          </Label>
          <Select value={tema} onValueChange={setTema}>
            <SelectTrigger id="tema">
              <SelectValue placeholder="Selecione um tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os temas</SelectItem>
              <SelectItem value="arvore">Árvores</SelectItem>
              <SelectItem value="buraco">Buracos</SelectItem>
              <SelectItem value="iluminacao">Iluminação</SelectItem>
              <SelectItem value="limpeza">Limpeza</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="respondida">Respondida</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Período
          </Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>
    </div>
  );
};

export default DemandasFilter;
