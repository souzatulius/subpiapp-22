
import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

const commonIcons = [
  'ClipboardList', 'MessageSquare', 'FileText', 'BarChart2',
  'PlusCircle', 'Search', 'Clock', 'AlertTriangle', 'CheckCircle',
  'FileCheck', 'ListFilter', 'Mail', 'Phone', 'Calendar', 'Bell',
  'User', 'Users', 'Settings', 'Home', 'File', 'Folder',
  'CreditCard', 'DollarSign', 'ShoppingCart', 'Archive'
];

interface IconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onValueChange
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [iconList, setIconList] = useState<string[]>(commonIcons);
  
  // Get currently selected icon component
  const selectedIconName = value;
  const SelectedIcon = selectedIconName && (LucideIcons as any)[selectedIconName] || LucideIcons.LayoutDashboard;
  
  useEffect(() => {
    if (search) {
      const filteredIcons = commonIcons.filter(icon => 
        icon.toLowerCase().includes(search.toLowerCase())
      );
      setIconList(filteredIcons);
    } else {
      setIconList(commonIcons);
    }
  }, [search]);
  
  const handleSelectIcon = (iconName: string) => {
    onValueChange(iconName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            <span>{selectedIconName || "Select icon"}</span>
          </div>
          <div className="opacity-50">▼</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <div className="p-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 opacity-50" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-auto p-2">
          <div className="grid grid-cols-4 gap-2">
            {iconList.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName];
              if (!Icon) return null;
              
              return (
                <Button
                  key={iconName}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0",
                    value === iconName && "bg-muted text-muted-foreground"
                  )}
                  onClick={() => handleSelectIcon(iconName)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
          {iconList.length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No icons found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
