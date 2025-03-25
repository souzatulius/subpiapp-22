
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TemaForm from './TemaForm';
import { Problem, Area } from '@/hooks/useProblems';

interface TemaEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Problem | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; area_coordenacao_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const TemaEditDialog: React.FC<TemaEditDialogProps> = ({
  isOpen,
  onClose,
  tema,
  areas,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !tema) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tema</DialogTitle>
        </DialogHeader>
        <TemaForm
          onSubmit={onSubmit}
          onCancel={onClose}
          areas={areas}
          isSubmitting={isSubmitting}
          defaultValues={{
            descricao: tema.descricao,
            area_coordenacao_id: tema.area_coordenacao_id,
          }}
          submitText="Salvar Alterações"
        />
      </DialogContent>
    </Dialog>
  );
};

export default TemaEditDialog;
