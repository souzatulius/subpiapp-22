
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProblemForm from './ProblemForm';
import { Area, Problem } from '@/hooks/problems';

interface ProblemEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; area_coordenacao_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ProblemEditDialog: React.FC<ProblemEditDialogProps> = ({
  isOpen,
  onClose,
  problem,
  areas,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !problem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Problema</DialogTitle>
        </DialogHeader>
        <ProblemForm
          onSubmit={onSubmit}
          onCancel={onClose}
          defaultValues={{
            descricao: problem.descricao,
            area_coordenacao_id: problem.area_coordenacao_id
          }}
          areas={areas}
          isSubmitting={isSubmitting}
          submitText="Salvar Alterações"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProblemEditDialog;
