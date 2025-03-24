
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  selectedFile,
  accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
  maxSize = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    
    if (file) {
      // Check file size (in MB)
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > maxSize) {
        toast.error(`Arquivo muito grande`, {
          description: `O arquivo deve ter menos de ${maxSize}MB.`
        });
        e.target.value = '';
        return;
      }
      
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName(null);
      onFileChange(null);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName(null);
    onFileChange(null);
    toast.success(`Arquivo removido`, {
      description: `O arquivo foi removido com sucesso.`
    });
  };

  return (
    <div className="space-y-2">
      {!selectedFile ? (
        <div className="flex items-center">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Arquivo
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
          <div className="flex items-center overflow-hidden">
            <Upload className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
            <span className="text-sm font-medium truncate">{fileName || selectedFile.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="p-1 h-auto"
          >
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
