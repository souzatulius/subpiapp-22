import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface DemandDetailProps {
  demand: any; // Replace 'any' with the actual type of your demand object
  onEdit: (demand: any) => void;
}

const DemandDetail: React.FC<DemandDetailProps> = ({ demand, onEdit }) => {
  const handleCopyToClipboard = async () => {
    const demandString = JSON.stringify(demand, null, 2);
    try {
      await navigator.clipboard.writeText(demandString);
      toast.success("Demanda copiada!", {
        description: "Agora você pode colar onde quiser."
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar a demanda para a área de transferência."
      });
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Detalhes da Demanda</h2>
      
      {/* Display demand details here */}
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(demand, null, 2)}
      </pre>

      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(demand)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button variant="secondary" size="sm" onClick={handleCopyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copiar para Clipboard
        </Button>
      </div>
    </div>
  );
};

export default DemandDetail;
