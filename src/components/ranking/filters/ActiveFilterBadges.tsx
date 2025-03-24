
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { OS156FilterOptions, OrderStatus, District } from '../types';
import { format } from 'date-fns';

interface ActiveFilterBadgesProps {
  filters: OS156FilterOptions;
  onAreaTecnicaChange: (value: 'Todos' | 'STM' | 'STLP') => void;
  onStatusChange: (newStatuses: OrderStatus[]) => void;
  onDistrictChange: (newDistricts: District[]) => void;
  onCompanyChange: (newCompanies: string[]) => void;
  onDateChange: (field: 'dataInicio' | 'dataFim', date?: Date) => void;
}

const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
  filters,
  onAreaTecnicaChange,
  onStatusChange,
  onDistrictChange,
  onCompanyChange,
  onDateChange
}) => {
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

  if (getActiveFilterCount() === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span className="text-xs font-medium text-gray-500">Filtros ativos:</span>
      
      {filters.areaTecnica !== 'Todos' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Área: {filters.areaTecnica}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onAreaTecnicaChange('Todos')} 
          />
        </Badge>
      )}
      
      {!filters.statuses.includes('Todos' as OrderStatus) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Status: {filters.statuses.join(', ')}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onStatusChange(['Todos' as OrderStatus])} 
          />
        </Badge>
      )}
      
      {!filters.districts.includes('Todos' as District) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Distritos: {filters.districts.length}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onDistrictChange(['Todos' as District])} 
          />
        </Badge>
      )}
      
      {!filters.empresa.includes('Todos') && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Empresas: {filters.empresa.length}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onCompanyChange(['Todos'])} 
          />
        </Badge>
      )}
      
      {filters.dataInicio && (
        <Badge variant="secondary" className="flex items-center gap-1">
          De: {format(filters.dataInicio, 'dd/MM/yy')}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onDateChange('dataInicio', undefined)} 
          />
        </Badge>
      )}
      
      {filters.dataFim && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Até: {format(filters.dataFim, 'dd/MM/yy')}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onDateChange('dataFim', undefined)} 
          />
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilterBadges;
