
"use client";

import * as React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  onRangeChange: (range: { from?: Date; to?: Date }) => void;
  align?: "start" | "center" | "end";
  className?: string;
}

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
                  {format(dateRange.from, "PPP", { locale: pt })} -{" "}
                  {format(dateRange.to, "PPP", { locale: pt })}
                </>
              ) : (
                format(dateRange.from, "PPP", { locale: pt })
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
            selected={{
              from: dateRange?.from,
              to: dateRange?.to,
            }}
            onSelect={(newRange) => {
              onRangeChange({
                from: newRange?.from,
                to: newRange?.to,
              });
            }}
            numberOfMonths={2}
            locale={pt}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
