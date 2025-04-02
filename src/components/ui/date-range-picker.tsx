
"use client";

import * as React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  dateRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  align?: "start" | "center" | "end";
  className?: string;
}

// Format dates as DD MMM/YY
const formatDateShort = (date: Date): string => {
  const day = format(date, "d", { locale: pt });
  const month = format(date, "MMM", { locale: pt });
  const year = format(date, "yy", { locale: pt });
  return `${day} ${month}/${year}`;
};

export function DatePickerWithRange({
  dateRange,
  onRangeChange,
  align = "start",
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDateShort(dateRange.from)} - {formatDateShort(dateRange.to)}
                </>
              ) : (
                formatDateShort(dateRange.from)
              )
            ) : (
              <span>Escolha um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onRangeChange}
            numberOfMonths={2}
            locale={pt}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Export DateRangePicker as an alias of DatePickerWithRange for backward compatibility
export const DateRangePicker = DatePickerWithRange;
