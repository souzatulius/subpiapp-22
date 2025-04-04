
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorOption {
  value: CardColor;
  label: string;
  class: string;
}

interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Partial<ActionCardItem>) => void;
  card: ActionCardItem | null;
}

// Ícones sugeridos para usar nos cards - separados por categorias
const SUGGESTED_ICONS = {
  comunicacao: ['MessageSquare', 'MessageCircle', 'MessageSquareText', 'Mail', 'Share2', 'Phone'],
  demandas: ['ClipboardList', 'ListTodo', 'CheckSquare', 'FileCheck', 'FilePlus2'],
  documentos: ['FileText', 'File', 'Files', 'Folder', 'FolderOpen'],
  estatisticas: ['BarChart2', 'PieChart', 'LineChart', 'TrendingUp', 'Activity'],
  acoes: ['Plus', 'PlusCircle', 'Edit', 'Pencil', 'Save', 'Check'],
  navegacao: ['Search', 'Home', 'ArrowLeft', 'ArrowRight', 'Settings'],
};

const COLOR_OPTIONS: ColorOption[] = [
  { value: "gray-400", label: "Gray 400", class: "bg-gray-400" },
  { value: "gray-800", label: "Gray 800", class: "bg-gray-800" },
  { value: "gray-950", label: "Gray 950", class: "bg-gray-950" },
  { value: "blue-700", label: "Blue 700", class: "bg-blue-700" },
  { value: "blue-900", label: "Blue 900", class: "bg-blue-900" },
  { value: "blue-960", label: "Blue 960", class: "bg-blue-960" },
  { value: "orange-400", label: "Orange 400", class: "bg-orange-400" },
  { value: "orange-500", label: "Orange 500", class: "bg-orange-500" },
  { value: "gray-200", label: "Gray 200", class: "bg-gray-200" },
  { value: "lime-500", label: "Lime 500", class: "bg-lime-500" },
  { value: "neutral-200", label: "Neutral 200", class: "bg-neutral-200" },
];

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  card
}) => {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<CardColor>("blue-700");
  const [iconId, setIconId] = useState("layout-dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sugeridos");
  
  // Reset the form when the modal opens or the card changes
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setColor(card.color);
      setIconId(card.iconId);
      setSearchTerm("");
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

  // Filtra os ícones com base na pesquisa
  const getFilteredIcons = () => {
    if (!searchTerm) return [];
    
    return Object.keys(LucideIcons)
      .filter(key => 
        typeof (LucideIcons as any)[key] === 'function' && 
        !['createLucideIcon', 'default'].includes(key) &&
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 25);
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
            
            <Tabs defaultValue="sugeridos" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sugeridos">Sugeridos</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="pesquisar">Pesquisar</TabsTrigger>
              </TabsList>
              
              {/* Tab de ícones sugeridos */}
              <TabsContent value="sugeridos" className="space-y-4">
                <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto p-2 border rounded-md">
                  {Object.entries(SUGGESTED_ICONS).map(([category, icons]) => (
                    <React.Fragment key={category}>
                      {icons.map((key) => (
                        <div
                          key={key}
                          className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                            iconId === key ? 'bg-blue-100 border-blue-500' : ''
                          }`}
                          onClick={() => setIconId(key)}
                          title={key}
                        >
                          {renderIconComponent(key)}
                          <span className="text-xs mt-1 truncate w-full text-center">{key.substring(0, 6)}</span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </TabsContent>
              
              {/* Tab de todos os ícones */}
              <TabsContent value="todos">
                <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto p-2 border rounded-md">
                  {Object.keys(LucideIcons)
                    .filter(key => 
                      typeof (LucideIcons as any)[key] === 'function' && 
                      !['createLucideIcon', 'default'].includes(key)
                    )
                    .slice(0, 60)
                    .map((key) => (
                      <div
                        key={key}
                        className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                          iconId === key ? 'bg-blue-100 border-blue-500' : ''
                        }`}
                        onClick={() => setIconId(key)}
                        title={key}
                      >
                        {renderIconComponent(key)}
                        <span className="text-xs mt-1 truncate w-full text-center">{key.substring(0, 6)}</span>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              {/* Tab de pesquisa de ícones */}
              <TabsContent value="pesquisar">
                <div className="space-y-2">
                  <Input
                    placeholder="Pesquisar ícones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="grid grid-cols-6 gap-2 h-36 overflow-y-auto p-2 border rounded-md">
                    {getFilteredIcons().map((key) => (
                      <div
                        key={key}
                        className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                          iconId === key ? 'bg-blue-100 border-blue-500' : ''
                        }`}
                        onClick={() => setIconId(key)}
                        title={key}
                      >
                        {renderIconComponent(key)}
                        <span className="text-xs mt-1 truncate w-full text-center">{key.substring(0, 6)}</span>
                      </div>
                    ))}
                    {getFilteredIcons().length === 0 && searchTerm && (
                      <div className="col-span-6 text-center py-4 text-gray-500">
                        Nenhum ícone encontrado
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid gap-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <div
                  key={colorOption.value}
                  className={`h-10 rounded-md cursor-pointer border-2 ${
                    color === colorOption.value 
                      ? 'border-blue-500' 
                      : 'border-transparent'
                  } ${colorOption.class}`}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.label}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Prévia</Label>
            <div className="mt-2 border p-4 rounded-md">
              <div className={`w-full h-40 rounded-xl shadow-md overflow-hidden ${color ? `bg-${color}` : 'bg-blue-700'}`}>
                <div className="relative h-full flex flex-col items-center justify-center text-center py-4">
                  <div className="text-white mb-2">
                    {renderIconComponent(iconId)}
                  </div>
                  <h3 className="font-semibold text-white text-xl">{title || "Título do Card"}</h3>
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

export default CardCustomizationModal;
