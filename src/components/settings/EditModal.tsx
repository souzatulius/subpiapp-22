
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, title, children, footerContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-subpi-blue">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footerContent && (
          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;
