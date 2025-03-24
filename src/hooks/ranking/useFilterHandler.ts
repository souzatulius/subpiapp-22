
import { FilterOptions, OrdemServico, OS156Item } from '@/components/ranking/types';
import { ordensToOS156Items } from './useDataFetcher';

export const useFilterHandler = (
  ordensData: OrdemServico[],
  generateChartData: (data: OS156Item[]) => void
) => {
  // Function to apply filters
  const applyFilters = (filters: FilterOptions) => {
    if (ordensData.length === 0) {
      return;
    }
    
    let filteredData = [...ordensData];
    
    // Apply date range filter
    if (filters.dateRange?.from) {
      const fromDate = new Date(filters.dateRange.from);
      filteredData = filteredData.filter(item => 
        new Date(item.criado_em) >= fromDate
      );
    }
    
    if (filters.dateRange?.to) {
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredData = filteredData.filter(item => 
        new Date(item.criado_em) <= toDate
      );
    }
    
    // Apply status filter
    if (filters.statuses && !filters.statuses.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filters.statuses.includes(item.status as any)
      );
    }
    
    // Apply service type filter
    if (filters.serviceTypes && !filters.serviceTypes.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filters.serviceTypes.includes(item.classificacao_servico as any)
      );
    }
    
    // Apply district filter
    if (filters.districts && !filters.districts.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filters.districts.includes(item.distrito as any)
      );
    }
    
    // Transform filtered OrdemServico to OS156Item for chart generation
    const chartItems: OS156Item[] = ordensToOS156Items(filteredData);
    
    // Generate charts with filtered data
    generateChartData(chartItems);
  };
  
  return { applyFilters };
};
