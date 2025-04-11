
import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface InsufficientDataMessageProps {
  message?: string;
  className?: string;
}

const InsufficientDataMessage: React.FC<InsufficientDataMessageProps> = ({ 
  message = "Dados insuficientes para gerar o gráfico", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full p-4 ${className}`}>
      <AlertOctagon className="h-12 w-12 text-orange-400 mb-3" />
      <p className="text-center text-gray-600 font-medium">{message}</p>
      <p className="text-center text-gray-500 text-sm mt-1">
        Faça upload de uma planilha com dados para visualização completa
      </p>
    </div>
  );
};

export default InsufficientDataMessage;
