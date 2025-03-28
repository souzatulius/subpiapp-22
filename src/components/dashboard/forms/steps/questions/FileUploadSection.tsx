
import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Trash2, X, ImageIcon } from 'lucide-react';
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
        
        // Store original filename with the URL
        const urlWithMeta = data.publicUrl;
        newUrls.push(urlWithMeta);
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

  // Helper function to get shortened file name
  const getShortenedFileName = (url: string) => {
    const fileName = url.split('/').pop() || '';
    const fileExt = fileName.split('.').pop() || '';
    
    if (fileName.length <= 12) return fileName;
    
    return `${fileName.substring(0, 8)}...${fileExt ? `.${fileExt}` : ''}`;
  };

  // Determine if it's an image file
  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|heic)$/i.test(url);
  };

  return (
    <div>
      <Label className="block mb-2">Anexos</Label>
      
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl transition ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-center p-6">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {uploading ? 'Enviando arquivos...' : 'Arraste arquivos ou clique para fazer upload'}
          </p>
          <p className="text-xs text-gray-500">Suporta imagens, PDFs e documentos (máximo 10MB)</p>
          
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
      </div>

      {/* Files Preview */}
      {anexos.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {anexos.map((fileUrl, index) => (
              <div 
                key={index} 
                className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-28 bg-gray-100 flex items-center justify-center p-2">
                  {isImageFile(fileUrl) ? (
                    <img 
                      src={fileUrl} 
                      alt="thumbnail" 
                      className="h-full object-contain max-w-full rounded-t-md"
                    />
                  ) : (
                    <FileText className="h-12 w-12 text-blue-500" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium text-gray-700 truncate" title={fileUrl.split('/').pop()}>
                    {getShortenedFileName(fileUrl)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
