
import React from 'react';

interface EmptyStateProps {
  filter: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-md border">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      {filter ? (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum resultado encontrado</h3>
          <p className="text-gray-500 max-w-md">
            Não encontramos nenhuma entidade que corresponda a "{filter}". 
            Tente outro termo ou limpe a pesquisa.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma entidade encontrada</h3>
          <p className="text-gray-500 max-w-md">
            Não há coordenações ou supervisões técnicas cadastradas no sistema.
            Adicione-as na seção Gestão Organizacional.
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyState;
