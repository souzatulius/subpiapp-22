
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onChange: (fileUrl: string) => void;
  value?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, value }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setFileName(file.name);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('demandas')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('demandas')
        .getPublicUrl(filePath);
        
      onChange(data.publicUrl);
      
      toast({
        title: 'Arquivo anexado',
        description: 'O arquivo foi anexado com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro ao anexar arquivo',
        description: error.message || 'Não foi possível anexar o arquivo.',
        variant: 'destructive',
      });
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = () => {
    onChange('');
    setFileName('');
  };
  
  return (
    <div>
      <Label>Anexar Arquivo</Label>
      {value || fileName ? (
        <div className="mt-2 flex items-center gap-2 p-2 border border-gray-300 rounded-lg">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700 flex-1 truncate">
            {fileName || value.split('/').pop()}
          </span>
          <button 
            type="button"
            onClick={handleRemoveFile}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                <span>{isUploading ? 'Enviando...' : 'Clique para anexar um arquivo'}</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, PDF até 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
