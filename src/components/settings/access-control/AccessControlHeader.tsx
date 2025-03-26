
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileDown, Printer, Shield, RefreshCw } from 'lucide-react';

interface AccessControlHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  handleExportCsv: () => void;
  handlePrint: () => void;
  handleRefresh: () => Promise<void>;
}

const AccessControlHeader: React.FC<AccessControlHeaderProps> = ({
  filter,
  setFilter,
  handleExportCsv,
  handlePrint,
  handleRefresh,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Controle de Acesso</h2>
          <p className="text-gray-500">Gerencie as permissões de acesso dos usuários</p>
        </div>
        
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
            <Button variant="outline" size="icon" onClick={handleExportCsv} title="Exportar CSV">
              <FileDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handlePrint} title="Imprimir">
              <Printer className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Atualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="text-blue-800 font-semibold flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4" />
          Sobre as permissões
        </h3>
        <p className="text-blue-700">
          As permissões controlam o que cada usuário pode fazer na plataforma. 
          Diferentes níveis de permissão dão acesso a diferentes funcionalidades.
        </p>
      </div>
    </>
  );
};

export default AccessControlHeader;
