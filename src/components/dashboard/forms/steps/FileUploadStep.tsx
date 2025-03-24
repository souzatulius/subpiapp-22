
import React from 'react';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import FileUploadField from '../components/FileUploadField';

interface FileUploadStepProps {
  selectedFile: File | null;
  handleFileChange: (file: File | null) => void;
  errors?: ValidationError[];
}

const FileUploadStep: React.FC<FileUploadStepProps> = ({
  selectedFile,
  handleFileChange,
  errors = []
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2 text-lg font-medium">
          Anexos da Demanda
        </Label>
        <p className="text-sm text-gray-500 mb-4">
          Você pode anexar um arquivo à sua demanda, como uma foto ou documento.
        </p>
      </div>
      
      <FileUploadField
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        label="Arquivo da demanda"
        fieldName="arquivo_url"
        errors={errors}
      />
    </div>
  );
};

export default FileUploadStep;
