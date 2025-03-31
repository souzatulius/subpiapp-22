
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ExportDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: string;
}

const ExportDashboardModal: React.FC<ExportDashboardModalProps> = ({
  isOpen,
  onClose,
  exportData
}) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    toast({
      title: "Copiado",
      description: "O JSON foi copiado para a área de transferência.",
      variant: "success"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
        <DialogTitle>Exportar Dashboard</DialogTitle>
        <DialogDescription>
          Copie o JSON abaixo para salvar a configuração do dashboard.
        </DialogDescription>
        
        <div className="mt-4 bg-gray-50 p-2 rounded-md">
          <textarea 
            className="w-full h-64 p-2 font-mono text-sm bg-gray-50 border-0 focus:ring-0" 
            value={exportData}
            readOnly
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button onClick={handleCopyToClipboard}>
            Copiar JSON
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDashboardModal;
