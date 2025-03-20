
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Demanda não encontrada", 
  description,
  action,
  onClose 
}) => {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-gray-500">{description}</p>}
      {action ? (
        action
      ) : onClose ? (
        <Button onClick={onClose} variant="outline" className="mt-4">
          Voltar
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
