
import React from 'react';
import EditModal from '../EditModal';
import ProblemForm from './ProblemForm';
import { Problem, Area } from '@/hooks/problems/types';

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
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Problema"
    >
      <ProblemForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValues={{
          descricao: problem.descricao,
          area_coordenacao_id: problem.area_coordenacao_id,
        }}
        areas={areas}
        isSubmitting={isSubmitting}
      />
    </EditModal>
  );
};

export default ProblemEditDialog;
