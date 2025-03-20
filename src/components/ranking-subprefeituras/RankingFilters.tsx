
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartFilters } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useFilterOptions } from './hooks/useFilterOptions';
import LocationFilters from './filters/LocationFilters';
import CategoryFilters from './filters/CategoryFilters';
import DateFilters from './filters/DateFilters';
import FilterActions from './filters/FilterActions';

interface RankingFiltersProps {
  onFilterChange: (filters: ChartFilters) => void;
  initialFilters?: ChartFilters;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<ChartFilters>(initialFilters);
  const { distritos, bairros, classificacoes, statusOptions, loading } = useFilterOptions();
  
  // Handle filter changes
  const handleFilterChange = (key: keyof ChartFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
    onFilterChange({});
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange(filters);
  };
  
  // Handle filter distrito change based on bairro selection
  useEffect(() => {
    if (filters.bairro) {
      // Fetch the district for this neighborhood
      const fetchDistritoForBairro = async () => {
        const { data } = await supabase
          .from('ordens_servico')
          .select('distrito')
          .eq('bairro', filters.bairro)
          .not('distrito', 'is', null)
          .limit(1);
          
        if (data && data.length > 0 && data[0].distrito) {
          handleFilterChange('distrito', data[0].distrito);
        }
      };
      
      fetchDistritoForBairro();
    }
  }, [filters.bairro]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Location Filters */}
          <LocationFilters 
            filters={filters}
            distritos={distritos}
            bairros={bairros}
            onFilterChange={handleFilterChange}
          />
          
          {/* Category Filters */}
          <CategoryFilters 
            filters={filters}
            classificacoes={classificacoes}
            statusOptions={statusOptions}
            onFilterChange={handleFilterChange}
          />
          
          {/* Date Filters */}
          <DateFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Filter Action Buttons */}
        <FilterActions 
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
        />
      </CardContent>
    </Card>
  );
};

export default RankingFilters;
