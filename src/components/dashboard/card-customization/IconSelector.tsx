
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface IconSelectorProps {
  selectedIconId: string;
  onSelectIcon: (iconId: string) => void;
}

export default function IconSelector({
  selectedIconId,
  onSelectIcon
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [icons, setIcons] = useState<{ id: string; component: any }[]>([]);

  useEffect(() => {
    const allIcons = getAllIcons();
    setIcons(allIcons);
  }, []);

  const filteredIcons = searchTerm
    ? icons.filter(icon => 
        icon.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : icons;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar ícones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 border-gray-300"
        />
      </div>
      
      <ScrollArea className="h-40 rounded-md border border-gray-200">
        <div className="grid grid-cols-6 gap-1 p-2">
          {filteredIcons.map((icon) => {
            const isSelected = icon.id === selectedIconId;
            return (
              <Button
                key={icon.id}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 rounded-md p-0 flex items-center justify-center",
                  isSelected && "bg-blue-100 text-blue-700 ring-1 ring-blue-500"
                )}
                onClick={() => onSelectIcon(icon.id)}
                title={icon.id}
              >
                <icon.component className="h-5 w-5" />
              </Button>
            );
          })}
          
          {filteredIcons.length === 0 && (
            <div className="col-span-6 py-4 text-center text-sm text-gray-500">
              Nenhum ícone encontrado
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="text-xs text-gray-500 mt-1">
        Ícone selecionado: {selectedIconId}
      </div>
    </div>
  );
}

// Utility function to get all icons from lucide-react
function getAllIcons() {
  const iconEntries = Object.entries(LucideIcons)
    .filter(([name]) => typeof name === 'string' && name !== 'createLucideIcon')
    .map(([name, component]) => ({
      id: name,
      component
    }));

  return iconEntries;
}
