
import React, { useRef, ChangeEvent, InputHTMLAttributes } from 'react';

interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  id: string;
  onChange: (file: File | null) => void;
  accept?: string;
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ 
  id, 
  onChange, 
  accept = '', 
  className = '',
  disabled = false,
  ...rest 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onChange(file || null);
  };

  const handleClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
        {...rest}
      />
      <div 
        onClick={handleClick}
        className={`flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'} ${className}`}
      >
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600">
            <label htmlFor={id} className={`relative cursor-pointer rounded-md font-medium text-blue-600 ${disabled ? 'opacity-50' : 'hover:text-blue-500'}`}>
              <span>Selecionar arquivo</span>
            </label>
            <p className="pl-1 text-gray-500">ou arraste e solte</p>
          </div>
          <p className="text-xs text-gray-500">XLSX, XLS até 10MB</p>
        </div>
      </div>
    </div>
  );
};
