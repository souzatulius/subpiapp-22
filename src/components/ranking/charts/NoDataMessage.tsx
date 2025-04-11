
import React from 'react';
import { UploadCloud } from 'lucide-react';

const NoDataMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
      <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg text-gray-500 font-medium">Sem dados disponíveis</p>
      <p className="text-sm text-gray-400 mt-2">Faça o upload de uma planilha SGZ para visualizar as análises</p>
    </div>
  );
};

export default NoDataMessage;
