
import * as React from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  locale?: any;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Selecione a data",
  className,
  locale,
}: DatePickerProps) {
  // Ensure date is valid before formatting
  const isDateValid = date && isValid(date);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !isDateValid && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isDateValid ? (
            format(date, "dd/MM/yyyy", { locale })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isDateValid ? date : undefined}
          onSelect={setDate}
          initialFocus
          locale={locale}
          className="p-3 pointer-events-auto"
          captionLayout="dropdown-buttons"
          fromYear={1940}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}
