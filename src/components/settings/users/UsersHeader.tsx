
import React from 'react';
import { Download, Printer, Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UsersHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  onOpenInviteDialog: () => void;
  onExportCsv?: () => void;
  onPrint?: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({
  filter,
  setFilter,
  onOpenInviteDialog,
  onExportCsv = () => {},
  onPrint = () => {},
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="text" 
            placeholder="Buscar usuários..." 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onExportCsv} title="Exportar CSV">
            <Download className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={onPrint} title="Imprimir">
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button onClick={onOpenInviteDialog}>
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersHeader;
