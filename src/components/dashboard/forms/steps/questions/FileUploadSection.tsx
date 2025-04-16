
import React, { useCallback, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { File, ImageIcon, Trash2, X, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { normalizeFileUrl } from '@/utils/questionFormatUtils';

interface FileUploadSectionProps {
  anexos: string[];
  onAnexosChange: (files: string[]) => void;
}

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/heic',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_SIZE_MB = 10;

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ anexos, onAnexosChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: 'Formato inválido',
          description: 'Permitido apenas: PNG, JPG, HEIC, PDF, DOC ou XLS.',
          variant: 'destructive'
        });
        continue;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: `Máximo permitido: ${MAX_SIZE_MB}MB.`,
          variant: 'destructive'
        });
        continue;
      }

      setIsUploading(true);

      try {
        // Upload to Supabase storage
        const fileId = uuidv4();
        const ext = file.name.split('.').pop();
        const filePath = `uploads/${fileId}.${ext}`;

        const { error } = await supabase.storage
          .from('demandas')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Erro ao fazer upload",
            description: error.message,
            variant: "destructive",
          });
          continue;
        }

        // Get the public URL
        const { data } = supabase.storage
          .from('demandas')
          .getPublicUrl(filePath);
        
        // Add the URL to anexos
        onAnexosChange([...anexos, data.publicUrl]);
        
        toast({
          title: "Arquivo adicionado",
          description: `${file.name} foi adicionado com sucesso.`,
        });
      } catch (error) {
        console.error('Error adding file:', error);
        toast({
          title: "Erro ao adicionar arquivo",
          description: `Não foi possível adicionar o arquivo ${file.name}.`,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  }, [anexos, onAnexosChange]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = [...anexos];
    updatedFiles.splice(index, 1);
    onAnexosChange(updatedFiles);
    
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido com sucesso.",
    });
  }, [anexos, onAnexosChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    // Reset the input so the same file can be selected again
    if (e.target.value) e.target.value = '';
  };

  // Helper function to determine if file is an image
  const isImageFile = useCallback((path: string): boolean => {
    if (!path) return false;
    
    try {
      const extension = path.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(extension || '');
    } catch (error) {
      console.error('Error checking file type:', error);
      return false;
    }
  }, []);

  // Helper function to get shortened file name
  const getFileName = useCallback((path: string, index: number): string => {
    try {
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
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} 
          transition-colors`}
        onClick={handleFileInputClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input 
          type="file" 
          id="file-upload" 
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange} 
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          disabled={isUploading}
        />
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center">
          {isUploading ? 'Enviando arquivo...' : 'Clique para adicionar arquivos ou arraste e solte aqui'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Arquivos aceitos: PDF, JPG, PNG, DOC, XLS (até 10MB)</p>
      </div>
      
      {anexos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {anexos.map((file, index) => (
            <div key={index} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-24 w-full bg-gray-100 rounded-t-xl flex items-center justify-center">
                {isImageFile(file) ? (
                  <img 
                    src={file} 
                    alt="preview" 
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      console.error('Error loading image preview');
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'flex items-center justify-center w-full h-full';
                        fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <FileText className="h-10 w-10 text-blue-500" />
                )}
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-xl opacity-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3">
                <span className="text-sm text-gray-600 truncate block">
                  {getFileName(file, index)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
