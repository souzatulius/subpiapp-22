
import React from 'react';
import { X } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  onClose: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <button 
        onClick={onClose}
        className="p-1 rounded-full hover:bg-gray-100"
        aria-label="Fechar"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

export default FormHeader;
