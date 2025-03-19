
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Printer, MessageSquarePlus } from 'lucide-react';

interface AnnouncementsHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  handleExportCsv: () => void;
  handlePrint: () => void;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
}

const AnnouncementsHeader: React.FC<AnnouncementsHeaderProps> = ({
  filter,
  setFilter,
  handleExportCsv,
  handlePrint,
  setIsCreateDialogOpen,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold">Comunicados</h2>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="text" 
            placeholder="Buscar comunicados..." 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleExportCsv} title="Exportar CSV">
            <Download className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={handlePrint} title="Imprimir">
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Novo Comunicado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsHeader;
