
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, subDays } from 'date-fns';

interface ReportsFilters {
  dateRange: DateRange;
  coordenacao: string;
  tema: string;
}

export const useReportsFilter = () => {
  // Default to last 30 days
  const today = new Date();
  
  const [filters, setFilters] = useState<ReportsFilters>({
    dateRange: {
      from: subDays(today, 30),
      to: today
    },
    coordenacao: 'todos',
    tema: 'todos'
  });

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  }, []);

  const handleCoordenacaoChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, coordenacao: value }));
  }, []);

  const handleTemaChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, tema: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: {
        from: subDays(new Date(), 30),
        to: new Date()
      },
      coordenacao: 'todos',
      tema: 'todos'
    });
  }, []);

  return {
    filters,
    handleDateRangeChange,
    handleCoordenacaoChange,
    handleTemaChange,
    resetFilters
  };
};
