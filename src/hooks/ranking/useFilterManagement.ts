
import { useState, useEffect } from 'react';
import { FilterOptions, ChartVisibility } from '@/components/ranking/types';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

export const useFilterManagement = () => {
  const { user } = useAuth();
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos'],
    companies: ['Todos'],
    areas: ['STM', 'STLP']
  });

  // State for chart visibility with all required properties
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    occurrences: true,
    resolutionTime: true,
    serviceTypes: true,
    neighborhoods: true,
    frequentServices: true,
    statusDistribution: true,
    statusTimeline: true,
    statusTransition: true,
    efficiencyRadar: true,
    criticalStatus: true,
    externalDistricts: true,
    servicesDiversity: true,
    timeToClose: true,
    dailyOrders: true
  });

  // Load user preferences from Supabase
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error('Error loading user preferences:', error);
          }
          return;
        }
        
        if (data && data.cards_config) {
          try {
            const config = typeof data.cards_config === 'string' 
              ? JSON.parse(data.cards_config) 
              : data.cards_config;
            
            if (config.filters) {
              // Handle date conversion for date ranges
              let parsedFilters = { ...config.filters };
              if (parsedFilters.dateRange) {
                if (parsedFilters.dateRange.from) {
                  parsedFilters.dateRange.from = new Date(parsedFilters.dateRange.from);
                }
                if (parsedFilters.dateRange.to) {
                  parsedFilters.dateRange.to = new Date(parsedFilters.dateRange.to);
                }
              }
              setFilters(parsedFilters);
            }
            
            if (config.chartVisibility) {
              setChartVisibility(config.chartVisibility);
            }
          } catch (e) {
            console.error('Error parsing user preferences:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load user preferences:', err);
      }
    };
    
    loadUserPreferences();
  }, [user]);

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Save to Supabase if user is logged in
      if (user) {
        saveUserPreferences({
          filters: updated,
          chartVisibility
        });
      }
      
      return updated;
    });
  };

  const handleChartVisibilityChange = (newVisibility: Partial<ChartVisibility>) => {
    setChartVisibility(prev => {
      const updated = { ...prev, ...newVisibility };
      
      // Save to Supabase if user is logged in
      if (user) {
        saveUserPreferences({
          filters,
          chartVisibility: updated
        });
      }
      
      return updated;
    });
  };

  // Helper function to save user preferences to Supabase
  const saveUserPreferences = async (preferences: { 
    filters: FilterOptions, 
    chartVisibility: ChartVisibility 
  }) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify({
            filters: preferences.filters,
            chartVisibility: preferences.chartVisibility,
            lastUpdated: new Date().toISOString()
          }),
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.error('Failed to save user preferences:', err);
    }
  };

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  };
};
