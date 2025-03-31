
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImportDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  importData: string;
  setImportData: (data: string) => void;
  onImport: () => void;
}

const ImportDashboardModal: React.FC<ImportDashboardModalProps> = ({
  isOpen,
  onClose,
  importData,
  setImportData,
  onImport
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
        <DialogTitle>Importar Dashboard</DialogTitle>
        <DialogDescription>
          Cole o JSON da configuração do dashboard para importar.
        </DialogDescription>
        
        <div className="mt-4">
          <textarea 
            className="w-full h-64 p-2 font-mono text-sm border rounded-md" 
            placeholder='{"cards_config": [...], "view_type": "dashboard"}'
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onImport}
            disabled={!importData.trim()}
          >
            Importar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDashboardModal;
