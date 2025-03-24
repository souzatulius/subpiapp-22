
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X, Filter } from 'lucide-react';
import { OS156FilterOptions, OrderStatus, District } from './types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface OS156FiltersProps {
  filters: OS156FilterOptions;
  onFiltersChange: (filters: OS156FilterOptions) => void;
  companies: string[];
  onApplyFilters: () => void;
}

const OS156Filters: React.FC<OS156FiltersProps> = ({
  filters,
  onFiltersChange,
  companies,
  onApplyFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAreaTecnicaChange = (value: string) => {
    onFiltersChange({
      ...filters,
      areaTecnica: value as 'Todos' | 'STM' | 'STLP'
    });
  };

  const handleStatusChange = (status: string) => {
    let newStatuses = [...filters.statuses];
    
    if (status === 'Todos') {
      newStatuses = ['Todos' as OrderStatus];
    } else {
      // Remove 'Todos' if present
      newStatuses = newStatuses.filter(s => s !== 'Todos');
      
      // Add or remove the status
      if (newStatuses.includes(status as OrderStatus)) {
        newStatuses = newStatuses.filter(s => s !== status);
      } else {
        newStatuses.push(status as OrderStatus);
      }
      
      // If no status is selected, add 'Todos'
      if (newStatuses.length === 0) {
        newStatuses = ['Todos' as OrderStatus];
      }
    }
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleCompanyChange = (company: string) => {
    let newCompanies = [...filters.empresa];
    
    if (company === 'Todos') {
      newCompanies = ['Todos'];
    } else {
      // Remove 'Todos' if present
      newCompanies = newCompanies.filter(c => c !== 'Todos');
      
      // Add or remove the company
      if (newCompanies.includes(company)) {
        newCompanies = newCompanies.filter(c => c !== company);
      } else {
        newCompanies.push(company);
      }
      
      // If no company is selected, add 'Todos'
      if (newCompanies.length === 0) {
        newCompanies = ['Todos'];
      }
    }
    
    onFiltersChange({ ...filters, empresa: newCompanies });
  };

  const handleDistrictChange = (district: string) => {
    let newDistricts = [...filters.districts];
    
    if (district === 'Todos') {
      newDistricts = ['Todos' as District];
    } else {
      // Remove 'Todos' if present
      newDistricts = newDistricts.filter(d => d !== 'Todos');
      
      // Add or remove the district
      if (newDistricts.includes(district as District)) {
        newDistricts = newDistricts.filter(d => d !== district);
      } else {
        newDistricts.push(district as District);
      }
      
      // If no district is selected, add 'Todos'
      if (newDistricts.length === 0) {
        newDistricts = ['Todos' as District];
      }
    }
    
    onFiltersChange({ ...filters, districts: newDistricts });
  };

  const handleDateChange = (field: 'dataInicio' | 'dataFim', date?: Date) => {
    onFiltersChange({
      ...filters,
      [field]: date
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      statuses: ['Todos' as OrderStatus],
      serviceTypes: ['Todos'],
      districts: ['Todos' as District],
      areaTecnica: 'Todos',
      empresa: ['Todos'],
      dataInicio: undefined,
      dataFim: undefined
    });
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    
    if (!filters.statuses.includes('Todos' as OrderStatus)) count++;
    if (!filters.districts.includes('Todos' as District)) count++;
    if (filters.areaTecnica !== 'Todos') count++;
    if (!filters.empresa.includes('Todos')) count++;
    if (filters.dataInicio) count++;
    if (filters.dataFim) count++;
    
    return count;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Filtros</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área Técnica</label>
              <Select
                value={filters.areaTecnica}
                onValueChange={handleAreaTecnicaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área técnica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todas</SelectItem>
                  <SelectItem value="STM">STM</SelectItem>
                  <SelectItem value="STLP">STLP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex flex-wrap gap-1">
                {['Todos', 'NOVO', 'CONC', 'PREPLAN', 'PRECANC', 'AB', 'PE'].map((status) => (
                  <Badge
                    key={status}
                    variant={filters.statuses.includes(status as OrderStatus) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      filters.statuses.includes(status as OrderStatus) ? 'bg-orange-500 hover:bg-orange-600' : ''
                    } ${['PREPLAN', 'PRECANC'].includes(status) ? 'border-red-300' : ''}`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
              <div className="flex flex-wrap gap-1">
                {['Todos', 'PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'].map((district) => (
                  <Badge
                    key={district}
                    variant={filters.districts.includes(district as District) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      filters.districts.includes(district as District) ? 'bg-orange-500 hover:bg-orange-600' : ''
                    }`}
                    onClick={() => handleDistrictChange(district)}
                  >
                    {district === 'Todos' ? district : district.split(' ').map(w => w[0]).join('')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dataInicio ? (
                      format(filters.dataInicio, 'PP', { locale: pt })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dataInicio}
                    onSelect={(date) => handleDateChange('dataInicio', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dataFim ? (
                      format(filters.dataFim, 'PP', { locale: pt })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dataFim}
                    onSelect={(date) => handleDateChange('dataFim', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {companies.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresas</label>
              <div className="max-h-20 overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={filters.empresa.includes('Todos') ? "default" : "outline"}
                    className={`cursor-pointer ${
                      filters.empresa.includes('Todos') ? 'bg-orange-500 hover:bg-orange-600' : ''
                    }`}
                    onClick={() => handleCompanyChange('Todos')}
                  >
                    Todas
                  </Badge>
                  {companies.map((company) => (
                    <Badge
                      key={company}
                      variant={filters.empresa.includes(company) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        filters.empresa.includes(company) ? 'bg-orange-500 hover:bg-orange-600' : ''
                      }`}
                      onClick={() => handleCompanyChange(company)}
                    >
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
              Limpar Todos
            </Button>
            <Button 
              variant="default" 
              onClick={() => {
                onApplyFilters();
                setIsOpen(false);
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      )}
      
      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-medium text-gray-500">Filtros ativos:</span>
            
            {filters.areaTecnica !== 'Todos' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Área: {filters.areaTecnica}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleAreaTecnicaChange('Todos')} 
                />
              </Badge>
            )}
            
            {!filters.statuses.includes('Todos' as OrderStatus) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {filters.statuses.join(', ')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, statuses: ['Todos' as OrderStatus] })} 
                />
              </Badge>
            )}
            
            {!filters.districts.includes('Todos' as District) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Distritos: {filters.districts.length}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, districts: ['Todos' as District] })} 
                />
              </Badge>
            )}
            
            {!filters.empresa.includes('Todos') && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Empresas: {filters.empresa.length}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, empresa: ['Todos'] })} 
                />
              </Badge>
            )}
            
            {filters.dataInicio && (
              <Badge variant="secondary" className="flex items-center gap-1">
                De: {format(filters.dataInicio, 'dd/MM/yy')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleDateChange('dataInicio', undefined)} 
                />
              </Badge>
            )}
            
            {filters.dataFim && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Até: {format(filters.dataFim, 'dd/MM/yy')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleDateChange('dataFim', undefined)} 
                />
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default OS156Filters;
