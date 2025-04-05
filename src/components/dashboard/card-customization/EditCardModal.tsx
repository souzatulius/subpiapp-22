
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ColorOption {
  value: CardColor;
  label: string;
  class: string;
}

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Partial<ActionCardItem>) => void;
  card: ActionCardItem | null;
}

// Ícones sugeridos para usar nos cards
const SUGGESTED_ICONS = [
  'MessageSquare', 'MessageCircle', 'MessageSquareText', 'Mail', 'Share2', 'Phone',
  'ClipboardList', 'ListTodo', 'CheckSquare', 'FileCheck', 'FilePlus2',
  'FileText', 'File', 'Files', 'Folder', 'FolderOpen',
  'BarChart2', 'PieChart', 'LineChart', 'TrendingUp', 'Activity',
  'Plus', 'PlusCircle', 'Edit', 'Pencil', 'Save', 'Check',
  'Search', 'Home', 'ArrowLeft', 'ArrowRight', 'Settings',
];

const COLOR_OPTIONS: ColorOption[] = [
  { value: "blue-vivid", label: "", class: "bg-[#0066FF]" },
  { value: "blue-dark", label: "", class: "bg-[#1D4ED8]" },
  { value: "green-neon", label: "", class: "bg-[#66FF66]" },
  { value: "gray-light", label: "", class: "bg-[#F5F5F5]" },
  { value: "orange-dark", label: "", class: "bg-[#F25C05]" },
  { value: "yellow", label: "", class: "bg-yellow-400" },
];

const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  card
}) => {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<CardColor>("blue-vivid");
  const [iconId, setIconId] = useState("layout-dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset the form when the modal opens or the card changes
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setColor(card.color as CardColor);
      setIconId(card.iconId);
    }
  }, [card, isOpen]);
  
  const handleSave = () => {
    if (!card) return;
    
    setIsSubmitting(true);
    
    const updatedCard: Partial<ActionCardItem> = {
      ...card,
      title,
      color,
      iconId,
    };
    
    onSave(updatedCard);
    setIsSubmitting(false);
  };
  
  const renderIconComponent = (iconId: string) => {
    const IconComponent = (LucideIcons as any)[iconId];
    if (!IconComponent) return null;
    return <IconComponent className="h-6 w-6" />;
  };

  // Get all available icons
  const getAllIcons = () => {
    // Start with suggested icons
    const allIcons = [...SUGGESTED_ICONS];
    
    // Add other icons from Lucide
    Object.keys(LucideIcons)
      .filter(key => 
        typeof (LucideIcons as any)[key] === 'function' && 
        !['createLucideIcon', 'default'].includes(key) &&
        !allIcons.includes(key)
      )
      .slice(0, 60 - SUGGESTED_ICONS.length)
      .forEach(key => allIcons.push(key));
    
    return allIcons;
  };
  
  // Helper to get text color based on background color
  const getTextColorForPreview = (colorValue: CardColor): string => {
    if (colorValue === 'gray-light' || colorValue === 'green-neon' || colorValue === 'yellow') {
      return 'text-gray-800';
    }
    return 'text-white';
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Card</SheetTitle>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do card"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto p-2 border rounded-md">
              {getAllIcons().map((key) => (
                <div
                  key={key}
                  className={`flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                    iconId === key ? 'bg-blue-100 border-blue-500' : ''
                  }`}
                  onClick={() => setIconId(key)}
                >
                  {renderIconComponent(key)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((colorOption) => (
                <div
                  key={colorOption.value}
                  className={`h-10 w-10 rounded-full cursor-pointer transition-all ${
                    color === colorOption.value 
                      ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' 
                      : 'hover:scale-110'
                  } ${colorOption.class}`}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.value}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Prévia</Label>
            <div className="mt-2 border p-4 rounded-md">
              <div 
                className={`w-full h-40 rounded-xl shadow-md overflow-hidden transition-all`}
                style={{
                  backgroundColor: COLOR_OPTIONS.find(c => c.value === color)?.class.replace('bg-', '').includes('[') 
                    ? COLOR_OPTIONS.find(c => c.value === color)?.class.replace('bg-[', '').replace(']', '') 
                    : color === 'yellow' ? '#FACC15' : color === 'blue-dark' ? '#1D4ED8' : '#0066FF'
                }}
              >
                <div className="relative h-full flex flex-col items-center justify-center text-center py-4">
                  <div className={getTextColorForPreview(color) + " mb-2"}>
                    {renderIconComponent(iconId)}
                  </div>
                  <h3 className={`font-semibold ${getTextColorForPreview(color)} text-xl`}>
                    {title || "Título do Card"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditCardModal;
