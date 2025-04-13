
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  value?: Option[];
  onChange?: (value: Option[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxSelected?: number;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Selecionar...',
  className,
  disabled = false,
  maxSelected,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option[]>(value);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value from props
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (option: Option) => {
    let updatedSelected: Option[];
    
    const isSelected = selected.some(item => item.value === option.value);
    
    if (isSelected) {
      updatedSelected = selected.filter(item => item.value !== option.value);
    } else {
      if (maxSelected && selected.length >= maxSelected) {
        // If we already have the max number of items selected, replace the last one
        updatedSelected = [...selected.slice(0, maxSelected - 1), option];
      } else {
        updatedSelected = [...selected, option];
      }
    }
    
    setSelected(updatedSelected);
    onChange?.(updatedSelected);
    
    // Focus the input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemove = (option: Option) => {
    const updatedSelected = selected.filter(item => item.value !== option.value);
    setSelected(updatedSelected);
    onChange?.(updatedSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !inputValue && selected.length > 0) {
      const updatedSelected = selected.slice(0, -1);
      setSelected(updatedSelected);
      onChange?.(updatedSelected);
    }
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between hover:bg-background',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
              className
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 mr-2">
              {selected.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selected.slice(0, 3).map(item => (
                    <Badge key={item.value} className="mr-1 px-1 py-0">
                      {item.label}
                    </Badge>
                  ))}
                  {selected.length > 3 && (
                    <Badge variant="secondary">+{selected.length - 3}</Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command onKeyDown={handleKeyDown}>
            <CommandInput 
              placeholder="Buscar..." 
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              <CommandGroup>
                {options.map(option => {
                  const isSelected = selected.some(item => item.value === option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option)}
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map(item => (
            <Badge
              key={item.value}
              className="px-2 py-1"
              variant="secondary"
            >
              {item.label}
              <button
                className="ml-1 rounded-full outline-none focus:ring-2"
                onClick={() => handleRemove(item)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
