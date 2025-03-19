
import React from 'react';

interface EmptyStateProps {
  filter: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border">
      <p className="text-gray-500">
        {filter ? 'Nenhum usuário encontrado para a busca' : 'Nenhum usuário cadastrado'}
      </p>
    </div>
  );
};

export default EmptyState;
