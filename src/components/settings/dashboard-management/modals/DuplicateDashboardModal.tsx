
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Department } from "@/hooks/dashboard-management/useDashboardManagement";

interface DuplicateDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: () => void;
  selectedDepartment: string;
  targetDepartment: string;
  setTargetDepartment: (id: string) => void;
  departments: Department[];
}

const DuplicateDashboardModal: React.FC<DuplicateDashboardModalProps> = ({
  isOpen,
  onClose,
  onDuplicate,
  selectedDepartment,
  targetDepartment,
  setTargetDepartment,
  departments
}) => {
  const sourceDepartment = departments.find(d => d.id === selectedDepartment);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Duplicar Dashboard</DialogTitle>
        <DialogDescription>
          Selecione a coordenação de destino para copiar a configuração atual do dashboard.
        </DialogDescription>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Origem:</Label>
            <div className="col-span-3">{sourceDepartment?.descricao || 'Coordenação não selecionada'}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Destino:</Label>
            <div className="col-span-3">
              <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a coordenação de destino" />
                </SelectTrigger>
                <SelectContent>
                  {departments
                    .filter(dept => dept.id !== selectedDepartment)
                    .map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.descricao}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onDuplicate}>
            Duplicar Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateDashboardModal;
