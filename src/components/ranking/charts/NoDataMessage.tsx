
import React from 'react';
import { FileSpreadsheet, UploadCloud } from 'lucide-react';

const NoDataMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-white p-8 rounded-xl border border-gray-200 text-center">
      <div className="relative mb-6">
        <FileSpreadsheet className="h-16 w-16 text-gray-300" />
        <UploadCloud className="h-6 w-6 text-orange-500 absolute -top-2 -right-2" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 mb-2">Nenhum dado disponível</h3>
      
      <p className="text-gray-500 max-w-md mb-6">
        Faça o upload de uma planilha do SGZ ou do Painel da Zeladoria para visualizar os dados dos gráficos.
      </p>
    </div>
  );
};

export default NoDataMessage;
