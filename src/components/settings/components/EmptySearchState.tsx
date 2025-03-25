
import React from 'react';

interface EmptySearchStateProps {
  searchQuery: string;
}

const EmptySearchState: React.FC<EmptySearchStateProps> = ({ searchQuery }) => {
  return (
    <div className="w-full py-12 text-center">
      <div className="mx-auto max-w-md">
        <h3 className="text-lg font-medium text-gray-900">Nenhuma configuração encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">
          Não encontramos configurações correspondentes a "{searchQuery}".
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Tente usar termos mais gerais ou verifique se há erros de digitação.
        </p>
      </div>
    </div>
  );
};

export default EmptySearchState;
