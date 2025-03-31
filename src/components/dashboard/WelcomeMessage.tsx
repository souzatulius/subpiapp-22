
import React from 'react';

interface WelcomeMessageProps {
  firstName?: string;
  title?: string;
  description?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  firstName = '', 
  title, 
  description 
}) => {
  const displayTitle = title || `Olá, ${firstName || 'Usuário'}!`;
  const displayDescription = description || 'Bem-vindo ao seu dashboard personalizado.';

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-800">{displayTitle}</h1>
      <p className="text-gray-600">{displayDescription}</p>
    </div>
  );
};

export default WelcomeMessage;
