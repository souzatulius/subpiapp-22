
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClose: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClose }) => {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-900">Demanda não encontrada</h3>
      <Button onClick={onClose} variant="outline" className="mt-4">
        Voltar
      </Button>
    </div>
  );
};

export default EmptyState;
