
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

  // Traduzir nomes para exibição
  const getDisplayName = (key: string, value: any): string => {
    if (key === 'dateRange' && value) {
      const fromDate = value.from ? new Date(value.from).toLocaleDateString('pt-BR') : '';
      const toDate = value.to ? new Date(value.to).toLocaleDateString('pt-BR') : '';
      return `${fromDate} até ${toDate}`;
    }

    // Para outros filtros, podemos mapear valores
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

  // Converter filtros para uma lista de filtros ativos para exibição
  const selectedFilters = useMemo(() => {
    const result: FilterDisplayInfo[] = [];

    // Mapear cada filtro para o formato de exibição
    Object.entries(filters).forEach(([key, value]) => {
      // Ignorar filtros com valores padrão
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

  // Atualizar um filtro específico
  const handleFilterChange = (key: FilterKey, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Limpar um filtro específico
  const clearFilter = (key: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: key === 'dateRange' ? undefined : 'todos' 
    }));
  };

  // Limpar todos os filtros
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
