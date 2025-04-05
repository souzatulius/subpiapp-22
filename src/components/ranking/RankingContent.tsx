
import React, { useState } from 'react';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import UploadSection from './UploadSection';
import ChartCategorySection from './ChartCategorySection';
import FilterDialog from './filters/FilterDialog';
import ActionsSection from './ActionsSection';
import { ChartItemsProvider } from './hooks/ChartItemsContext';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  disableCardContainers?: boolean;
  hideUploadSection?: boolean;
}

const RankingContent: React.FC<RankingContentProps> = ({ 
  filterDialogOpen, 
  setFilterDialogOpen,
  disableCardContainers = false,
  hideUploadSection = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState('efficiency');
  const [filters, setFilters] = useState({
    status: ['Todos'],
    serviceTypes: ['Todos'],
    distritos: ['Todos']
  });
  const [chartVisibility, setChartVisibility] = useState({
    evolution: true,
    serviceTypes: true,
    resolutionTime: true,
    districtPerformance: true,
    departmentComparison: true,
    oldestPendingList: true,
    responsibility: true
  });

  const handleFiltersChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
  };

  const handleChartVisibilityChange = (newVisibility) => {
    setChartVisibility({...chartVisibility, ...newVisibility});
  };
  
  return (
    <ChartItemsProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <FilterSection 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              chartVisibility={chartVisibility}
              onChartVisibilityChange={handleChartVisibilityChange}
            />
          </div>
          
          {!hideUploadSection && (
            <div className="upload-section">
              <UploadSection />
            </div>
          )}
        </div>
        
        <ChartCategorySection 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <ChartsSection 
          category={selectedCategory} 
          disableContainers={disableCardContainers}
        />
      </div>
      
      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
        onResetFilters={() => setFilters({
          status: ['Todos'],
          serviceTypes: ['Todos'],
          distritos: ['Todos']
        })}
      />
    </ChartItemsProvider>
  );
};

export default RankingContent;
