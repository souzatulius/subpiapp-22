
import { useState } from 'react';

export const useProcessoDialog = () => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setProcessoToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteConfirmOpen(false);
  };

  const resetDeleteDialogState = () => {
    setDeleteConfirmOpen(false);
    setProcessoToDelete(null);
  };

  return {
    deleteConfirmOpen,
    processoToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    resetDeleteDialogState
  };
};
