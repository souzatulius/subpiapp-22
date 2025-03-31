
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  currentIcon?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentIcon
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define a set of available icons both from Lucide and custom SVG icons
  const availableIcons = [
    // System Icons
    { name: 'File', category: 'Sistema' },
    { name: 'FileText', category: 'Sistema' },
    { name: 'FileEdit', category: 'Sistema' },
    { name: 'Folder', category: 'Sistema' },
    { name: 'FolderOpen', category: 'Sistema' },
    { name: 'Mail', category: 'Sistema' },
    { name: 'Calendar', category: 'Sistema' },
    { name: 'Clock', category: 'Sistema' },
    { name: 'Bell', category: 'Sistema' },
    { name: 'Search', category: 'Sistema' },
    { name: 'Settings', category: 'Sistema' },
    { name: 'User', category: 'Sistema' },
    { name: 'Users', category: 'Sistema' },
    
    // Communication Icons
    { name: 'MessageSquare', category: 'Comunicação' },
    { name: 'MessageCircle', category: 'Comunicação' },
    { name: 'MessageSquarePlus', category: 'Comunicação' },
    { name: 'Share', category: 'Comunicação' },
    { name: 'Send', category: 'Comunicação' },
    { name: 'Phone', category: 'Comunicação' },
    { name: 'PhoneCall', category: 'Comunicação' },
    { name: 'Video', category: 'Comunicação' },
    
    // Media Icons
    { name: 'Image', category: 'Mídia' },
    { name: 'Camera', category: 'Mídia' },
    { name: 'Video', category: 'Mídia' },
    { name: 'Music', category: 'Mídia' },
    { name: 'Radio', category: 'Mídia' },
    { name: 'Tv', category: 'Mídia' },
    { name: 'Monitor', category: 'Mídia' },
    { name: 'Smartphone', category: 'Mídia' },
    
    // Social Media Icons
    { name: 'Instagram', category: 'Redes Sociais' },
    { name: 'Facebook', category: 'Redes Sociais' },
    { name: 'Twitter', category: 'Redes Sociais' },
    { name: 'Youtube', category: 'Redes Sociais' },
    { name: 'Linkedin', category: 'Redes Sociais' },
    
    // Location Icons
    { name: 'Map', category: 'Localização' },
    { name: 'MapPin', category: 'Localização' },
    { name: 'Navigation', category: 'Localização' },
    { name: 'Globe', category: 'Localização' },
    { name: 'Compass', category: 'Localização' },
    
    // Status Icons
    { name: 'AlertCircle', category: 'Status' },
    { name: 'AlertTriangle', category: 'Status' },
    { name: 'CheckCircle', category: 'Status' },
    { name: 'XCircle', category: 'Status' },
    { name: 'InfoCircle', category: 'Status' },
    { name: 'HelpCircle', category: 'Status' },
    
    // Action Icons
    { name: 'Plus', category: 'Ação' },
    { name: 'Minus', category: 'Ação' },
    { name: 'X', category: 'Ação' },
    { name: 'Check', category: 'Ação' },
    { name: 'Edit', category: 'Ação' },
    { name: 'Trash', category: 'Ação' },
    
    // Transportation Icons
    { name: 'Car', category: 'Transporte' },
    { name: 'Bus', category: 'Transporte' },
    { name: 'Truck', category: 'Transporte' },
    
    // Buildings and Urban Icons
    { name: 'Building', category: 'Edifícios e Urbano' },
    { name: 'Home', category: 'Edifícios e Urbano' },
    { name: 'Warehouse', category: 'Edifícios e Urbano' },
    
    // Misc Icons
    { name: 'Book', category: 'Diversos' },
    { name: 'Bookmark', category: 'Diversos' },
    { name: 'Star', category: 'Diversos' },
    { name: 'Heart', category: 'Diversos' },
    { name: 'Zap', category: 'Diversos' },
    { name: 'Clipboard', category: 'Diversos' },
    { name: 'Scissors', category: 'Diversos' },
    { name: 'Flag', category: 'Diversos' },
    { name: 'Award', category: 'Diversos' },
    { name: 'Briefcase', category: 'Diversos' },
    { name: 'Wrench', category: 'Diversos' },
    { name: 'Tool', category: 'Diversos' },
    { name: 'Shield', category: 'Diversos' },
    { name: 'Umbrella', category: 'Diversos' },
  ];
  
  // Filter icons based on search query
  const filteredIcons = availableIcons.filter(
    icon => icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           icon.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group icons by category
  const groupedIcons = filteredIcons.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {} as Record<string, typeof filteredIcons>);

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedIcons).sort();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Selecione um ícone</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar ícones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          {sortedCategories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-500">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {groupedIcons[category].map(icon => {
                  const IconComponent = (LucideIcons as any)[icon.name];
                  return (
                    <Button
                      key={icon.name}
                      variant="outline"
                      className={`h-16 w-full flex flex-col items-center justify-center p-2 hover:border-blue-500 hover:bg-blue-50 ${
                        currentIcon === icon.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => onSelect(icon.name)}
                    >
                      {IconComponent && <IconComponent className="h-6 w-6 mb-1" />}
                      <span className="text-xs truncate max-w-full">{icon.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconSelector;
