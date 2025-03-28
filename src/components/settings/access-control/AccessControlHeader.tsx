
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, Printer, RefreshCw } from 'lucide-react';

interface AccessControlHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  handleExportCsv: () => void;
  handlePrint: () => void;
  handleRefresh: () => void;
}

const AccessControlHeader: React.FC<AccessControlHeaderProps> = ({
  filter,
  setFilter,
  handleExportCsv,
  handlePrint,
  handleRefresh
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="w-full md:w-1/2">
        <Input
          placeholder="Pesquisar por coordenação ou supervisão técnica..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          className="flex items-center gap-1"
        >
          <FileDown size={16} />
          <span>Exportar CSV</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer size={16} />
          <span>Imprimir</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} />
          <span>Atualizar</span>
        </Button>
      </div>
    </div>
  );
};

export default AccessControlHeader;
