
import React from 'react';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ isPreview = false, department = 'default' }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Página de Comunicação {department !== 'default' ? `- ${department}` : ''}
      </h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">
          {isPreview 
            ? "Esta é uma visualização da página de comunicação que será configurada para novos usuários."
            : "Bem-vindo à página de comunicação."}
        </p>
      </div>
    </div>
  );
};

export default ComunicacaoDashboard;
