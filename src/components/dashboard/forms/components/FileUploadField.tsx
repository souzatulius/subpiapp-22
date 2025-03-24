
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileType, X, FileImage } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';

interface FileUploadFieldProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  errors?: ValidationError[];
  fieldName?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  selectedFile,
  onFileChange,
  label = "Anexar arquivo",
  errors = [],
  fieldName = "arquivo"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  return (
    <div>
      <Label className={`block mb-2 ${hasError(fieldName) ? 'text-orange-500 font-semibold' : ''}`}>
        {label}
      </Label>
      
      {selectedFile ? (
        <div className="border border-gray-300 rounded-md p-4 relative">
          <div className="flex items-center">
            <FileImage className="h-8 w-8 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed p-6 rounded-md flex flex-col items-center justify-center text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${hasError(fieldName) ? 'border-orange-500' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">Arraste um arquivo ou clique para selecionar</p>
          <p className="text-xs text-gray-500 mb-3">PNG, JPG, PDF até 10MB</p>
          <Input
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            id="file-upload"
            accept="image/*,.pdf"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Selecionar arquivo
          </Button>
        </div>
      )}
      
      {hasError(fieldName) && (
        <p className="text-orange-500 text-sm mt-1">{getErrorMessage(fieldName)}</p>
      )}
    </div>
  );
};

export default FileUploadField;
