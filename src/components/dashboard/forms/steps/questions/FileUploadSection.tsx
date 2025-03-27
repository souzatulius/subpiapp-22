
import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Trash2, X } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const files = Array.from(event.dataTransfer.files);
      if (files.length === 0) return;
      await uploadFiles(files);
    }, []);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const newUrls: string[] = [];
    
    try {
      for (const file of files) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: 'Arquivo muito grande',
            description: `O arquivo ${file.name} excede o limite de 10MB.`,
            variant: 'destructive'
          });
          continue;
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('demandas')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error('Erro ao fazer upload:', uploadError);
          toast({
            title: 'Erro ao anexar arquivo',
            description: `Falha ao enviar ${file.name}: ${uploadError.message}`,
            variant: 'destructive',
          });
          continue;
        }
        
        // Get public URL
        const { data } = supabase.storage
          .from('demandas')
          .getPublicUrl(filePath);
          
        newUrls.push(data.publicUrl);
      }
      
      if (newUrls.length > 0) {
        onAnexosChange([...anexos, ...newUrls]);
        toast({
          title: 'Arquivos anexados',
          description: `${newUrls.length} arquivos foram anexados com sucesso.`,
        });
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro ao anexar arquivos',
        description: error.message || 'Não foi possível anexar um ou mais arquivos.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    await uploadFiles(files);
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
      <div 
        className={`border-2 border-dashed rounded-xl p-6 transition ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-center mb-4">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {uploading ? 'Enviando arquivos...' : 'Arraste arquivos ou clique para fazer upload'}
          </p>
          <p className="text-xs text-gray-500">Suporta imagens, PDFs e documentos (máximo 5MB)</p>
          
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="mt-4"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            Selecionar Arquivos
          </Button>
        </div>

        {anexos.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              {anexos.map((fileUrl, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm truncate max-w-[200px]">{fileUrl.split('/').pop()}</span>
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
    </div>
  );
};

export default FileUploadSection;
