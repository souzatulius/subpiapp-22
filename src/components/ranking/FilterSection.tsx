
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterOptions, ChartVisibility } from './types';
import DateRangeFilter from './filters/DateRangeFilter';
import StatusFilter from './filters/StatusFilter';
import ServiceTypeFilter from './filters/ServiceTypeFilter';
import DistrictFilter from './filters/DistrictFilter';
import ActiveFilters from './filters/ActiveFilters';
import ChartVisibilityManager from './filters/ChartVisibilityManager';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal, BarChart } from 'lucide-react';

interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  chartVisibility: ChartVisibility;
  onChartVisibilityChange: (visibility: Partial<ChartVisibility>) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  chartVisibility,
  onChartVisibilityChange
}) => {
  const [expandedFilter, setExpandedFilter] = useState<string>('filtros');
  
  const handleDateRangeChange = (range: any) => {
    onFiltersChange({ dateRange: range });
  };
  
  // Updated to handle array of statuses
  const handleStatusChange = (statuses: string[]) => {
    onFiltersChange({ status: statuses });
  };
  
  // Already expects array, no change needed
  const handleServiceTypeChange = (types: string[]) => {
    onFiltersChange({ serviceTypes: types });
  };
  
  const handleDistrictChange = (district: string) => {
    let newDistricts = [...(filters.distritos || [])];
    
    if (district === 'Todos') {
      newDistricts = ['Todos'];
    } else {
      newDistricts = newDistricts.filter(d => d !== 'Todos');
      
      if (newDistricts.includes(district)) {
        newDistricts = newDistricts.filter(d => d !== district);
      } else {
        newDistricts.push(district);
      }
      
      if (newDistricts.length === 0) {
        newDistricts = ['Todos'];
      }
    }
    
    onFiltersChange({ distritos: newDistricts });
  };
  
  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      status: ['Todos'],
      serviceTypes: ['Todos'],
      distritos: ['Todos']
    });
  };
  
  const handleChartVisibilityToggle = (chart: keyof ChartVisibility) => {
    onChartVisibilityChange({ 
      [chart]: !chartVisibility[chart] 
    });
  };
  
  const toggleSection = (section: string) => {
    if (expandedFilter === section) {
      setExpandedFilter('');
    } else {
      setExpandedFilter(section);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-orange-600" />
            Filtros e Gerenciamento de Visualização
          </CardTitle>
          <div className="flex space-x-3">
            <button
              onClick={() => toggleSection('filtros')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                expandedFilter === 'filtros' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-orange-700 border border-orange-300 hover:bg-orange-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {expandedFilter === 'filtros' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => toggleSection('graficos')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                expandedFilter === 'graficos' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-orange-700 border border-orange-300 hover:bg-orange-50'
              }`}
            >
              <BarChart className="h-4 w-4" />
              Gráficos
              {expandedFilter === 'graficos' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {expandedFilter === 'filtros' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 border-b border-gray-200"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DateRangeFilter 
                  dateRange={filters.dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
                
                <StatusFilter
                  statuses={filters.status || []}
                  onStatusChange={handleStatusChange}
                />
                
                <ServiceTypeFilter
                  serviceTypes={filters.serviceTypes || []}
                  onServiceTypeChange={handleServiceTypeChange}
                />
                
                <DistrictFilter
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
              </div>
              
              <ActiveFilters
                filters={filters}
                onDateRangeClear={() => onFiltersChange({ dateRange: undefined })}
                onStatusChange={handleStatusChange}
                onServiceTypeChange={handleServiceTypeChange}
                onDistrictChange={handleDistrictChange}
                onClearAllFilters={clearFilters}
              />
            </div>
          </motion.div>
        )}
        
        {expandedFilter === 'graficos' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <ChartVisibilityManager
              chartVisibility={chartVisibility}
              onChartVisibilityToggle={handleChartVisibilityToggle}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterSection;
