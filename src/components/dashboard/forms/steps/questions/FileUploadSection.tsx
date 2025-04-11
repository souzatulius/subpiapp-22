
import React from 'react';
import { Label } from '@/components/ui/label';
import { File, ImageIcon, Trash2 } from 'lucide-react'; // Using File instead of FilePdf which is not available
import { Button } from '@/components/ui/button';

interface FileUploadSectionProps {
  anexos: string[];
  onAnexosChange: (files: string[]) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ anexos, onAnexosChange }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...anexos];
      
      // This is a simplified version - in a real app, you'd upload to a server here
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        // Mock file URL - in real app this would come from your file upload service
        const fileUrl = URL.createObjectURL(file);
        newFiles.push(fileUrl);
      }
      
      onAnexosChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...anexos];
    updatedFiles.splice(index, 1);
    onAnexosChange(updatedFiles);
  };

  const isImageFile = (path: string): boolean => {
    const extension = path.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  return (
    <div className="space-y-4">
      <Label className="form-question-title">Anexos</Label>
      
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden"
          onChange={handleFileChange} 
          multiple
        />
        <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center">Clique para adicionar arquivos ou arraste e solte aqui</p>
        <p className="text-xs text-gray-400 mt-1">Arquivos aceitos: PDF, JPG, PNG, DOC</p>
      </div>
      
      {anexos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {anexos.map((file, index) => (
            <div key={index} className="border rounded-md p-3 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                {isImageFile(file) ? (
                  <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <img src={file} alt="preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <File className="h-10 w-10 text-blue-500" />
                )}
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
                  {file.split('/').pop() || `File ${index + 1}`}
                </span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
