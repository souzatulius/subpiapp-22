
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onChange?: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChange) {
      onChange(file);
    }
  };

  return (
    <div>
      <Label>Anexar Arquivo</Label>
      <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg shadow-lg">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
              <span>Clique para anexar um arquivo</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF até 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
