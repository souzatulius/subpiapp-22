
import React, { useEffect } from 'react';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import ActionsSection from './ActionsSection';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useFilterManagement } from '@/hooks/relatorios/useFilterManagement';
import { useChartData } from '@/hooks/relatorios/useChartData';

const RelatoriosContent = () => {
  const { user } = useAuth();
  
  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  } = useFilterManagement();
  
  const { chartData, isLoading } = useChartData(filters);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Relatórios das Demandas</h1>
      
      <FilterSection 
        filters={filters} 
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
      />
      
      <ChartsSection 
        chartData={chartData} 
        isLoading={isLoading}
        chartVisibility={chartVisibility}
      />
      
      <ActionsSection />
    </div>
  );
};

export default RelatoriosContent;
