
import React from 'react';

interface FormHeaderProps {
  title: string;
  onClose: () => void;
  showTitleAndClose?: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title, 
  onClose, 
  showTitleAndClose = true 
}) => {
  if (!showTitleAndClose) return null;
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <button 
        onClick={onClose}
        className="p-1 rounded-full hover:bg-gray-100"
        aria-label="Fechar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );
};

export default FormHeader;
