
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementProps {
  fulfilled: boolean;
  label: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ fulfilled, label }) => {
  return (
    <div className="flex items-center gap-2">
      {fulfilled ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-xs ${fulfilled ? 'text-green-600' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
};

export default PasswordRequirement;
