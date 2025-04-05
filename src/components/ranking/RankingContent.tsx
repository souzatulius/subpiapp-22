
import React, { useState } from 'react';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import UploadSection from './UploadSection';
import ChartCategorySection from './ChartCategorySection';
import FilterDialog from './filters/FilterDialog';
import ActionsSection from './ActionsSection';
import { ChartItemsProvider } from './hooks/ChartItemsContext';
import { ChartVisibility } from './types';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState({
    status: ['Todos'],
    serviceTypes: ['Todos'],
    distritos: ['Todos']
  });
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    statusDistribution: true,
    topCompanies: true,
    districtDistribution: true,
    servicesByDepartment: true,
    servicesByDistrict: true,
    timeComparison: true,
    dailyDemands: true,
    statusTransition: true,
    closureTime: true,
    neighborhoodComparison: true,
    districtEfficiencyRadar: true,
    externalDistricts: true,
    efficiencyImpact: true,
    criticalStatus: true,
    serviceDiversity: true,
    districtPerformance: true,
    serviceTypes: true,
    resolutionTime: true,
    responsibility: true,
    evolution: true,
    departmentComparison: true,
    oldestPendingList: true
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
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={['all', 'trends', 'performance', 'distribution']}
        />
        
        <ChartsSection 
          chartData={{}}
          isLoading={false}
          chartVisibility={chartVisibility}
          sgzData={[]}
          painelData={[]}
          onSimulateIdealRanking={() => {}}
          isSimulationActive={false}
          disableCardContainers={disableCardContainers}
        />
      </div>
      
      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={(chartName, isVisible) => {
          setChartVisibility(prev => ({
            ...prev,
            [chartName]: isVisible
          }));
        }}
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
