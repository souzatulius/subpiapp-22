
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { File, ImageIcon, Trash2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface FileUploadSectionProps {
  anexos: string[];
  onAnexosChange: (files: string[]) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ anexos, onAnexosChange }) => {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...anexos];
      
      // This is a simplified version - in a real app, you'd upload to a server here
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        try {
          // Mock file URL - in real app this would come from your file upload service
          const fileUrl = URL.createObjectURL(file);
          newFiles.push(fileUrl);
          
          // Optional: Show success message
          toast({
            title: "Arquivo adicionado",
            description: `${file.name} foi adicionado com sucesso.`,
          });
        } catch (error) {
          console.error('Error creating object URL:', error);
          toast({
            title: "Erro ao adicionar arquivo",
            description: `Não foi possível adicionar o arquivo ${file.name}.`,
            variant: "destructive",
          });
        }
      }
      
      onAnexosChange(newFiles);
    }
  }, [anexos, onAnexosChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = [...anexos];
      
      Array.from(e.dataTransfer.files).forEach(file => {
        try {
          const fileUrl = URL.createObjectURL(file);
          newFiles.push(fileUrl);
        } catch (error) {
          console.error('Error creating object URL:', error);
        }
      });
      
      onAnexosChange(newFiles);
    }
  }, [anexos, onAnexosChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = [...anexos];
    
    // Revoke the object URL to avoid memory leaks
    try {
      URL.revokeObjectURL(updatedFiles[index]);
    } catch (error) {
      console.error('Error revoking object URL:', error);
    }
    
    updatedFiles.splice(index, 1);
    onAnexosChange(updatedFiles);
    
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido com sucesso.",
    });
  }, [anexos, onAnexosChange]);

  const isImageFile = useCallback((path: string): boolean => {
    if (!path) return false;
    
    try {
      const extension = path.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '') || path.startsWith('blob:');
    } catch (error) {
      console.error('Error checking file type:', error);
      return false;
    }
  }, []);

  const getFileIcon = useCallback((path: string) => {
    if (isImageFile(path)) {
      try {
        return (
          <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            <img 
              src={path} 
              alt="preview" 
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error('Error loading image preview');
                e.currentTarget.src = '';
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.appendChild(
                  Object.assign(document.createElement('div'), {
                    className: 'flex items-center justify-center w-full h-full',
                    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>'
                  })
                );
              }}
            />
          </div>
        );
      } catch (error) {
        console.error('Error creating image preview:', error);
        return <ImageIcon className="h-10 w-10 text-blue-500" />;
      }
    } else {
      return <File className="h-10 w-10 text-blue-500" />;
    }
  }, [isImageFile]);

  const getFileName = useCallback((path: string, index: number): string => {
    try {
      // For object URLs or relative paths, use a generic name
      if (path.startsWith('blob:') || !path.includes('/')) {
        return `Arquivo ${index + 1}`;
      }
      return path.split('/').pop() || `Arquivo ${index + 1}`;
    } catch (error) {
      console.error('Error getting file name:', error);
      return `Arquivo ${index + 1}`;
    }
  }, []);

  return (
    <div className="space-y-4">
      <Label className="form-question-title">Anexos</Label>
      
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => document.getElementById('file-upload')?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden"
          onChange={handleFileChange} 
          multiple
        />
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center">Clique para adicionar arquivos ou arraste e solte aqui</p>
        <p className="text-xs text-gray-400 mt-1">Arquivos aceitos: PDF, JPG, PNG, DOC</p>
      </div>
      
      {anexos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {anexos.map((file, index) => (
            <div key={index} className="border rounded-xl p-3 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 overflow-hidden">
                {getFileIcon(file)}
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
                  {getFileName(file, index)}
                </span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
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
