
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface FileUploadSectionProps {
  anexos: string[];
  onAnexosChange: (files: string[]) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ 
  anexos, 
  onAnexosChange 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const uploadMultipleFiles = async (files: File[]) => {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileId = uuidv4();
      const fileExt = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      // Set initial progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('demandas')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('demandas')
          .getPublicUrl(filePath);
          
        urls.push(data.publicUrl);
        
        // Update progress to complete
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      }
    }
    
    return urls;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setUploading(true);
    
    try {
      // Upload files and get public URLs
      const publicUrls = await uploadMultipleFiles(newFiles);
      
      // Update form data with public URLs
      if (publicUrls.length > 0) {
        onAnexosChange([...(anexos || []), ...publicUrls]);
      }
      
      toast({
        title: 'Arquivos anexados',
        description: `${publicUrls.length} arquivos foram anexados com sucesso.`,
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro ao anexar arquivos',
        description: error.message || 'Não foi possível anexar um ou mais arquivos.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeFile = (index: number) => {
    const newAnexosUrls = [...anexos];
    newAnexosUrls.splice(index, 1);
    onAnexosChange(newAnexosUrls);
    
    toast({
      title: 'Arquivo removido',
      description: 'O arquivo foi removido da lista de anexos.',
    });
  };

  return (
    <div>
      <Label className="block mb-2">Anexos</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <input
          type="file"
          id="file-upload"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              const changeEvent = {
                target: { files }
              } as React.ChangeEvent<HTMLInputElement>;
              handleFileChange(changeEvent);
            }
          }}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {uploading ? 'Enviando arquivos...' : 'Arraste arquivos ou clique para fazer upload'}
            </p>
            <p className="text-xs text-gray-500">Suporta imagens, PDFs e documentos (máximo 5MB)</p>
          </div>
        </label>
      </div>

      {anexos && anexos.length > 0 && (
        <div className="mt-4 space-y-2">
          <Label>Arquivos anexados</Label>
          <div className="flex flex-col gap-2">
            {anexos.map((fileUrl, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{fileUrl.split('/').pop()}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
