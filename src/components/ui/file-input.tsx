
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

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
        {...rest}
      />
      <div 
        className={`flex items-center space-x-2 ${className}`}
        onClick={handleButtonClick}
      >
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          Escolher Arquivo
        </button>
        <span className="text-sm text-gray-500">
          {fileInputRef.current?.files?.[0]?.name || "Nenhum arquivo selecionado"}
        </span>
      </div>
    </div>
  );
};
