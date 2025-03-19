
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  requirements: {
    min: boolean;
    uppercase: boolean;
    number: boolean;
  };
  visible: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements, visible }) => {
  if (!visible) return null;

  return (
    <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm animate-fade-in">
      <p className="font-medium mb-2 text-[#111827]">Requisitos da senha:</p>
      <ul className="space-y-1">
        <li className="flex items-center">
          {requirements.min ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={requirements.min ? 'text-green-700' : 'text-[#6B7280]'}>
            Entre 5 e 12 caracteres
          </span>
        </li>
        <li className="flex items-center">
          {requirements.uppercase ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={requirements.uppercase ? 'text-green-700' : 'text-[#6B7280]'}>
            Pelo menos 1 letra maiúscula
          </span>
        </li>
        <li className="flex items-center">
          {requirements.number ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={requirements.number ? 'text-green-700' : 'text-[#6B7280]'}>
            Pelo menos 1 número
          </span>
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
