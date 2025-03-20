
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChartFilters } from '../types';

interface DateFiltersProps {
  filters: ChartFilters;
  onFilterChange: (key: keyof ChartFilters, value: string | null) => void;
}

const DateFilters: React.FC<DateFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <>
      {/* Date range filters */}
      <div className="space-y-2">
        <Label htmlFor="dataDe">Data inicial</Label>
        <Input
          id="dataDe"
          type="date"
          value={filters.dataDe || ""}
          onChange={(e) => onFilterChange('dataDe', e.target.value || null)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dataAte">Data final</Label>
        <Input
          id="dataAte"
          type="date"
          value={filters.dataAte || ""}
          onChange={(e) => onFilterChange('dataAte', e.target.value || null)}
        />
      </div>
    </>
  );
};

export default DateFilters;
