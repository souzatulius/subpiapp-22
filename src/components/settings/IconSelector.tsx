
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  onClose: () => void;
  isOpen?: boolean;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  onSelect, 
  onClose,
  isOpen = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lucide' | 'url'>('lucide');
  const [customUrl, setCustomUrl] = useState('');

  // Get all Lucide icons
  const lucideIcons = Object.keys(LucideIcons)
    .filter(key => 
      // Filter out non-icon exports and search
      typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' && 
      key !== 'createLucideIcon' && 
      !['Circle', 'Square', 'default'].includes(key) &&
      key.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort();

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleSelectIcon = () => {
    if (activeTab === 'lucide' && selectedIcon) {
      onSelect(selectedIcon);
    } else if (activeTab === 'url' && customUrl) {
      onSelect(customUrl);
    }
  };

  const renderLucideIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<{ className?: string }>;
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
        </DialogHeader>
        
        <div className="flex space-x-2 mb-4">
          <Button
            type="button"
            variant={activeTab === 'lucide' ? 'default' : 'outline'}
            onClick={() => setActiveTab('lucide')}
            className="flex-1"
          >
            Ícones do Sistema
          </Button>
          <Button
            type="button"
            variant={activeTab === 'url' ? 'default' : 'outline'}
            onClick={() => setActiveTab('url')}
            className="flex-1"
          >
            URL Personalizada
          </Button>
        </div>
        
        {activeTab === 'lucide' ? (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar ícones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2 overflow-y-auto p-1" style={{ maxHeight: '400px' }}>
              {lucideIcons.map((iconName) => (
                <div
                  key={iconName}
                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-all ${
                    selectedIcon === iconName ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleIconClick(iconName)}
                >
                  {renderLucideIcon(iconName)}
                  <span className="text-xs mt-2 text-center truncate w-full">{iconName}</span>
                </div>
              ))}
              {lucideIcons.length === 0 && (
                <div className="col-span-5 py-8 text-center text-gray-500">
                  Nenhum ícone encontrado para "{searchTerm}"
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="iconUrl" className="block text-sm font-medium mb-1">
                URL do ícone (SVG, PNG ou JPG)
              </label>
              <div className="flex space-x-2">
                <Input
                  id="iconUrl"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://exemplo.com/icone.svg"
                  className="flex-1"
                />
                {customUrl && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCustomUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {customUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Pré-visualização
                </label>
                <div className="border rounded-md p-4 flex justify-center">
                  <img 
                    src={customUrl} 
                    alt="Icon preview" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      // Add error class to show loading failed
                      e.currentTarget.classList.add('border', 'border-red-500');
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFsZXJ0LXRyaWFuZ2xlIj48cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40NiAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTNaIi8+PGxpbmUgeDE9IjEyIiB5MT0iOSIgeDI9IjEyIiB5Mj0iMTMiLz48bGluZSB4MT0iMTIiIHkxPSIxNyIgeDI9IjEyLjAxIiB5Mj0iMTciLz48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSelectIcon}
            disabled={(activeTab === 'lucide' && !selectedIcon) || (activeTab === 'url' && !customUrl)}
          >
            Selecionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IconSelector;
