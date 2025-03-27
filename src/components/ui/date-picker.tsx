import * as React from "react";
import { useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Selecione a data",
  className,
}: DatePickerProps) {
  const today = new Date();

  const roundToNextSlot = (date: Date) => {
    const minutes = date.getMinutes();
    const rounded = minutes < 30 ? 30 : 0;
    const hour = minutes < 30 ? date.getHours() : date.getHours() + 1;
    const adjusted = new Date(date);
    adjusted.setHours(Math.min(Math.max(hour, 6), 22), rounded, 0, 0);
    return adjusted;
  };

  useEffect(() => {
    if (!date) {
      setDate(roundToNextSlot(today));
    }
  }, []);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [day, month, year] = value.split("/");
    if (day && month && year) {
      const parsed = new Date(+year, +month - 1, +day);
      if (!isNaN(parsed.getTime())) {
        const current = roundToNextSlot(parsed);
        setDate(current);
      }
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(e.target.value));
      setDate(newDate);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setMinutes(parseInt(e.target.value));
      setDate(newDate);
    }
  };

  const renderHourOptions = () => {
    const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6–22
    return hours.map((h) => (
      <option key={h} value={h}>
        {String(h).padStart(2, "0")}
      </option>
    ));
  };

  const renderMinuteOptions = () => {
    return [0, 30].map((m) => (
      <option key={m} value={m}>
        {String(m).padStart(2, "0")}
      </option>
    ));
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                value={format(date, "dd/MM/yyyy")}
                onChange={handleManualInput}
                placeholder="dd/mm/aaaa"
              />
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                const adjusted = roundToNextSlot(selectedDate);
                setDate(adjusted);
              }
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={date?.getHours() ?? 6}
          onChange={handleHourChange}
        >
          {renderHourOptions()}
        </select>
        :
        <select
          className="border rounded px-2 py-1 text-sm"
          value={date?.getMinutes() ?? 0}
          onChange={handleMinuteChange}
        >
          {renderMinuteOptions()}
        </select>
      </div>
    </div>
  );
}
