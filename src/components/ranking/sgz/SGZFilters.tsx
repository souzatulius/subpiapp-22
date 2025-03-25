
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SGZFilterOptions } from '@/types/sgz';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SGZFiltersProps {
  filters: SGZFilterOptions;
  onFiltersChange: (filters: SGZFilterOptions) => void;
  isLoading: boolean;
}

const SGZFilters: React.FC<SGZFiltersProps> = ({ 
  filters, 
  onFiltersChange,
  isLoading
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (status: string) => {
    let newStatuses = [...filters.status];
    
    if (status === 'Todos') {
      newStatuses = ['Todos'];
    } else {
      // Remove 'Todos' if present
      newStatuses = newStatuses.filter(s => s !== 'Todos');
      
      // Add or remove the status
      if (newStatuses.includes(status)) {
        newStatuses = newStatuses.filter(s => s !== status);
      } else {
        newStatuses.push(status);
      }
      
      // If no status is selected, add 'Todos'
      if (newStatuses.length === 0) {
        newStatuses = ['Todos'];
      }
    }
    
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handleAreaTecnicaChange = (area: 'Todos' | 'STM' | 'STLP') => {
    onFiltersChange({ ...filters, areaTecnica: area });
  };

  const handleDistritoChange = (distrito: string) => {
    let newDistritos = [...filters.distrito];
    
    if (distrito === 'Todos') {
      newDistritos = ['Todos'];
    } else {
      // Remove 'Todos' if present
      newDistritos = newDistritos.filter(d => d !== 'Todos');
      
      // Add or remove the distrito
      if (newDistritos.includes(distrito)) {
        newDistritos = newDistritos.filter(d => d !== distrito);
      } else {
        newDistritos.push(distrito);
      }
      
      // If no distrito is selected, add 'Todos'
      if (newDistritos.length === 0) {
        newDistritos = ['Todos'];
      }
    }
    
    onFiltersChange({ ...filters, distrito: newDistritos });
  };

  const handleDateChange = (type: 'dataDe' | 'dataAte', date?: Date) => {
    onFiltersChange({ ...filters, [type]: date });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: ['Todos'],
      areaTecnica: 'Todos',
      distrito: ['Todos'],
      dataDe: undefined,
      dataAte: undefined,
      fornecedor: ['Todos']
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (!filters.status.includes('Todos')) count++;
    if (filters.areaTecnica !== 'Todos') count++;
    if (!filters.distrito.includes('Todos')) count++;
    if (filters.dataDe || filters.dataAte) count++;
    if (!filters.fornecedor.includes('Todos')) count++;
    return count;
  };

  const renderStatusBadge = (status: string, selected: boolean) => {
    const getStatusColor = () => {
      switch (status) {
        case 'NOVO': return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
        case 'AB': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
        case 'PE': return 'bg-purple-100 hover:bg-purple-200 text-purple-800';
        case 'CONC': return 'bg-green-100 hover:bg-green-200 text-green-800';
        case 'PREPLAN': return 'bg-red-100 hover:bg-red-200 text-red-800';
        case 'PRECANC': return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
        case 'FECHADO': return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
        default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
      }
    };

    return (
      <Badge 
        key={status}
        variant={selected ? 'default' : 'outline'}
        className={selected ? 'bg-orange-500 hover:bg-orange-600' : getStatusColor()}
        onClick={() => handleStatusChange(status)}
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Filtros</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm gap-1"
        >
          <Filter className="h-4 w-4" />
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-orange-100 text-orange-800">
              {getActiveFilterCount()}
            </Badge>
          )}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {renderStatusBadge('Todos', filters.status.includes('Todos'))}
                {renderStatusBadge('NOVO', filters.status.includes('NOVO'))}
                {renderStatusBadge('AB', filters.status.includes('AB'))}
                {renderStatusBadge('PE', filters.status.includes('PE'))}
                {renderStatusBadge('CONC', filters.status.includes('CONC'))}
                {renderStatusBadge('PREPLAN', filters.status.includes('PREPLAN'))}
                {renderStatusBadge('PRECANC', filters.status.includes('PRECANC'))}
                {renderStatusBadge('FECHADO', filters.status.includes('FECHADO'))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Área Técnica</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filters.areaTecnica === 'Todos' ? 'default' : 'outline'}
                  className={filters.areaTecnica === 'Todos' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleAreaTecnicaChange('Todos')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={filters.areaTecnica === 'STM' ? 'default' : 'outline'}
                  className={filters.areaTecnica === 'STM' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleAreaTecnicaChange('STM')}
                >
                  STM
                </Badge>
                <Badge 
                  variant={filters.areaTecnica === 'STLP' ? 'default' : 'outline'}
                  className={filters.areaTecnica === 'STLP' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleAreaTecnicaChange('STLP')}
                >
                  STLP
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Distrito</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filters.distrito.includes('Todos') ? 'default' : 'outline'}
                  className={filters.distrito.includes('Todos') ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleDistritoChange('Todos')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={filters.distrito.includes('PINHEIROS') ? 'default' : 'outline'}
                  className={filters.distrito.includes('PINHEIROS') ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleDistritoChange('PINHEIROS')}
                >
                  Pinheiros
                </Badge>
                <Badge 
                  variant={filters.distrito.includes('ALTO DE PINHEIROS') ? 'default' : 'outline'}
                  className={filters.distrito.includes('ALTO DE PINHEIROS') ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleDistritoChange('ALTO DE PINHEIROS')}
                >
                  Alto de Pinheiros
                </Badge>
                <Badge 
                  variant={filters.distrito.includes('ITAIM BIBI') ? 'default' : 'outline'}
                  className={filters.distrito.includes('ITAIM BIBI') ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleDistritoChange('ITAIM BIBI')}
                >
                  Itaim Bibi
                </Badge>
                <Badge 
                  variant={filters.distrito.includes('JARDIM PAULISTA') ? 'default' : 'outline'}
                  className={filters.distrito.includes('JARDIM PAULISTA') ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleDistritoChange('JARDIM PAULISTA')}
                >
                  Jardim Paulista
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Data Inicial</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dataDe ? (
                        format(filters.dataDe, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dataDe}
                      onSelect={(date) => handleDateChange('dataDe', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Data Final</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dataAte ? (
                        format(filters.dataAte, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dataAte}
                      onSelect={(date) => handleDateChange('dataAte', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
              
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Aplicar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      
      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <CardContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {!filters.status.includes('Todos') && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex gap-1">
                Status: {filters.status.join(', ')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, status: ['Todos'] })}
                />
              </Badge>
            )}
            
            {filters.areaTecnica !== 'Todos' && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex gap-1">
                Área: {filters.areaTecnica}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, areaTecnica: 'Todos' })}
                />
              </Badge>
            )}
            
            {!filters.distrito.includes('Todos') && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex gap-1">
                Distrito: {filters.distrito.join(', ')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, distrito: ['Todos'] })}
                />
              </Badge>
            )}
            
            {(filters.dataDe || filters.dataAte) && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex gap-1">
                Período: {filters.dataDe ? format(filters.dataDe, 'dd/MM/yyyy') : 'início'} até {filters.dataAte ? format(filters.dataAte, 'dd/MM/yyyy') : 'hoje'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, dataDe: undefined, dataAte: undefined })}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SGZFilters;
