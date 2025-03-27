
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, AlertTriangle } from 'lucide-react';
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
  const [displayFile, setDisplayFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Set display file name when component mounts or value changes
  React.useEffect(() => {
    if (value && value.startsWith('http') && !value.startsWith('blob:')) {
      // Extract filename from the URL
      const filename = value.split('/').pop();
      if (filename) {
        setFileName(filename);
        setDisplayFile(value);
      }
    }
  }, [value]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadError(null);
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Arquivo muito grande. O tamanho máximo permitido é 10MB.');
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é 10MB.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Formato de arquivo não permitido. Use PNG, JPG, PDF, DOC, XLS, etc.');
      toast({
        title: 'Formato não permitido',
        description: 'Use formatos como PNG, JPG, PDF, DOC, XLS, etc.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    setFileName(file.name);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      console.log('Uploading file to bucket: demandas, path:', filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('demandas')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL and save that instead of the blob URL
      const { data } = supabase.storage
        .from('demandas')
        .getPublicUrl(filePath);
        
      const publicUrl = data.publicUrl;
      console.log('File uploaded successfully, public URL:', publicUrl);
      
      // Set the public URL to be saved in the database
      onChange(publicUrl);
      setDisplayFile(publicUrl);
      
      toast({
        title: 'Arquivo anexado',
        description: 'O arquivo foi anexado com sucesso.',
        variant: 'success',
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      setUploadError(error.message || 'Erro desconhecido ao enviar o arquivo');
      toast({
        title: 'Erro ao anexar arquivo',
        description: error.message || 'Não foi possível anexar o arquivo.',
        variant: 'destructive',
      });
      setFileName('');
      setDisplayFile(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = () => {
    onChange('');
    setFileName('');
    setDisplayFile(null);
    setUploadError(null);
  };
  
  return (
    <div>
      <Label>Anexar Arquivo</Label>
      {displayFile ? (
        <div className="mt-2 flex items-center gap-2 p-2 border border-gray-300 rounded-lg">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700 flex-1 truncate">
            {fileName}
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
        <div className="mt-2">
          {uploadError && (
            <div className="mb-2 text-sm text-red-600 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>{uploadError}</span>
            </div>
          )}
          
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
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
                    accept=".png,.jpg,.jpeg,.heic,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.gif"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF, DOC, XLS até 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
