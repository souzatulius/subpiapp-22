import { useState, useMemo } from 'react';
import { DateRange } from '@/components/ui/date-range-picker';

type FilterKey = 'dateRange' | 'district' | 'status' | 'origin';

interface Filters {
  dateRange?: DateRange;
  district: string;
  status: string;
  origin: string;
}

interface FilterDisplayInfo {
  key: string;
  label: string;
  value: string;
}

export const useAdvancedFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: undefined,
    district: 'todos',
    status: 'todos',
    origin: 'todos'
  });

  const getDisplayName = (key: string, value: any): string => {
    if (key === 'dateRange' && value) {
      const fromDate = value.from ? new Date(value.from).toLocaleDateString('pt-BR') : '';
      const toDate = value.to ? new Date(value.to).toLocaleDateString('pt-BR') : '';
      return `${fromDate} até ${toDate}`;
    }

    const displayMap: Record<string, Record<string, string>> = {
      district: {
        'todos': 'Todos',
        'itaim-bibi': 'Itaim Bibi',
        'pinheiros': 'Pinheiros',
        'jardim-paulista': 'Jardim Paulista',
        'alto-de-pinheiros': 'Alto de Pinheiros'
      },
      status: {
        'todos': 'Todos',
        'pendente': 'Pendente',
        'em-andamento': 'Em andamento',
        'concluido': 'Concluído'
      },
      origin: {
        'todos': 'Todos',
        'imprensa': 'Imprensa',
        'vereadores': 'Vereadores',
        'politicos': 'Políticos',
        'interno': 'Demandas Internas',
        'secom': 'SECOM'
      }
    };

    return displayMap[key]?.[value] || value;
  };

  const selectedFilters = useMemo(() => {
    const result: FilterDisplayInfo[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'dateRange' && value) {
        result.push({
          key,
          label: 'Período',
          value: getDisplayName(key, value)
        });
      } else if (value && value !== 'todos') {
        result.push({
          key,
          label: key === 'district' ? 'Distrito' : 
                key === 'status' ? 'Status' : 'Origem',
          value: getDisplayName(key, value)
        });
      }
    });

    return result;
  }, [filters]);

  const handleFilterChange = (key: FilterKey, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: key === 'dateRange' ? undefined : 'todos' 
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: undefined,
      district: 'todos',
      status: 'todos',
      origin: 'todos'
    });
  };

  return {
    filters,
    setFilters,
    selectedFilters,
    handleFilterChange,
    clearFilter,
    clearAllFilters
  };
};
