
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  onClose: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" onClick={onClose} className="p-1.5 rounded-full">
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </Button>
      <h2 className="text-xl font-semibold text-[#003570]">
        {title}
      </h2>
      <Button variant="ghost" onClick={onClose} className="p-1.5 rounded-full">
        <X className="h-5 w-5 text-gray-600" />
      </Button>
    </div>
  );
};

export default FormHeader;
