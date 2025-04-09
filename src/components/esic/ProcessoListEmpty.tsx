
import React from 'react';
import { Search, FileQuestion } from 'lucide-react';

interface ProcessoListEmptyProps {
  searchTerm?: string;
}

const ProcessoListEmpty: React.FC<ProcessoListEmptyProps> = ({ searchTerm = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
      {searchTerm ? (
        <>
          <Search className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">Nenhum resultado encontrado</h3>
          <p className="text-gray-500 text-center mt-2">
            Não foi possível encontrar processos com o termo "{searchTerm}".
          </p>
        </>
      ) : (
        <>
          <FileQuestion className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">Nenhum processo encontrado</h3>
          <p className="text-gray-500 text-center mt-2">
            Não há processos cadastrados. Clique em "Novo Processo" para adicionar um.
          </p>
        </>
      )}
    </div>
  );
};

export default ProcessoListEmpty;
