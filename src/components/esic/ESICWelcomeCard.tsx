
import React from 'react';

interface ESICWelcomeCardProps {}

const ESICWelcomeCard: React.FC<ESICWelcomeCardProps> = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-4 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-blue-900 mb-2">Sistema de Informação ao Cidadão (e-SIC)</h2>
      <p className="text-blue-800">
        Acompanhe, gerencie e responda às solicitações de informação feitas ao Sistema de Informação ao Cidadão.
      </p>
    </div>
  );
};

export default ESICWelcomeCard;
