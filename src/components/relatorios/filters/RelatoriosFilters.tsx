import React, { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface RelatoriosFiltersProps {
  className?: string;
  dateRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const RelatoriosFilters: React.FC<RelatoriosFiltersProps> = ({
  className,
  dateRange,
  onRangeChange,
  searchTerm,
  onSearchTermChange,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="grid gap-4">
        <h2 className="text-lg font-semibold">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range Picker */}
          <div>
            <Label htmlFor="date">Período</Label>
            <DateRangePicker
              value={dateRange}
              onChange={onRangeChange}
            />
          </div>

          {/* Search Term Input */}
          <div>
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              type="search"
              id="search"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onResetFilters}>
            Limpar Filtros
          </Button>
          <Button type="button" onClick={onApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosFilters;
