
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  requirements?: {
    min: boolean;
    uppercase: boolean;
    number: boolean;
  };
  visible?: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ 
  password, 
  requirements = { min: false, uppercase: false, number: false },
  visible = true 
}) => {
  if (!visible) return null;

  // If requirements are not provided, check them based on the password
  const effectiveRequirements = requirements || {
    min: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  };

  return (
    <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm animate-fade-in">
      <p className="font-medium mb-2 text-[#111827]">Requisitos da senha:</p>
      <ul className="space-y-1">
        <li className="flex items-center">
          {effectiveRequirements.min ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={effectiveRequirements.min ? 'text-green-700' : 'text-[#6B7280]'}>
            Pelo menos 8 caracteres
          </span>
        </li>
        <li className="flex items-center">
          {effectiveRequirements.uppercase ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={effectiveRequirements.uppercase ? 'text-green-700' : 'text-[#6B7280]'}>
            Pelo menos 1 letra maiúscula
          </span>
        </li>
        <li className="flex items-center">
          {effectiveRequirements.number ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={effectiveRequirements.number ? 'text-green-700' : 'text-[#6B7280]'}>
            Pelo menos 1 número
          </span>
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
