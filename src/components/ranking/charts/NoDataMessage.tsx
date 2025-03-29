
import React from 'react';
import { BarChart3, FileUp, Info } from 'lucide-react';

const NoDataMessage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-orange-200 p-8 flex flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-orange-50 rounded-full p-4">
        <BarChart3 className="h-12 w-12 text-orange-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Sem dados para visualização</h3>
      <p className="text-gray-600 max-w-md">
        Para visualizar os gráficos e análises, faça o upload das planilhas SGZ e do Painel da Zeladoria na seção acima.
      </p>
      <div className="bg-orange-50 p-4 rounded-md border border-orange-100 max-w-md">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-800">
            Após o upload, os dados serão processados automaticamente e os gráficos serão atualizados para mostrar as análises e comparações entre as bases.
          </p>
        </div>
      </div>
      <div className="flex items-center text-orange-600 mt-2">
        <FileUp className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">Clique em "Selecionar Planilha SGZ" para começar</span>
      </div>
    </div>
  );
};

export default NoDataMessage;
