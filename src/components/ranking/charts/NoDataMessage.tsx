
import React from 'react';

const NoDataMessage: React.FC = () => {
  return (
    <div className="text-center p-10 border rounded-lg">
      <p className="text-muted-foreground">
        Não há dados disponíveis. Por favor, faça upload de uma planilha.
      </p>
    </div>
  );
};

export default NoDataMessage;
