import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface FiltersSectionProps {
  dateRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({ dateRange, onRangeChange }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <DateRangePicker
            value={dateRange}
            onChange={onRangeChange}
            align="start"
          />
      </CardContent>
    </Card>
  );
};

export default FiltersSection;
