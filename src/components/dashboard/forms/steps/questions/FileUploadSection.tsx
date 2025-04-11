
import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Trash2, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
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
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          toast({
            title: 'Arquivo muito grande',
            description: `O arquivo ${file.name} excede o limite de 10MB.`,
            variant: 'destructive'
          });
          continue;
        }
        
        // Generate unique ID for the file
        const fileId = uuidv4();
        const fileExt = file.name.split('.').pop();
        const filePath = `uploads/${fileId}.${fileExt}`;
        
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
        
        // Normalize URL before storing
        const normalizedUrl = normalizeFileUrl(data.publicUrl);
        
        console.log('File uploaded successfully:', {
          fileName: file.name,
          filePath,
          publicUrl: data.publicUrl,
          normalizedUrl
        });
        
        newUrls.push(normalizedUrl);
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
    try {
      const urlObj = new URL(url);
      const fileName = urlObj.pathname.split('/').pop() || '';
      const fileExt = fileName.split('.').pop() || '';
      
      try {
        const decoded = decodeURIComponent(fileName);
        
        if (decoded.length <= 12) return decoded;
        return `${decoded.substring(0, 8)}...${fileExt ? `.${fileExt}` : ''}`;
      } catch {
        if (fileName.length <= 12) return fileName;
        return `${fileName.substring(0, 8)}...${fileExt ? `.${fileExt}` : ''}`;
      }
    } catch {
      return 'Arquivo';
    }
  };

  // Determine file type and return appropriate icon/preview
  const getFileComponent = (url: string) => {
    if (isImageFile(url)) {
      return (
        <img 
          src={url} 
          alt="thumbnail" 
          className="h-full w-full object-contain"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyQzIgMTcuNTIyOCA2LjQ3NzE1IDIyIDEyIDIyWiIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTE1IDlMOSAxNSIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTkgOUwxNSAxNSIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+';
            e.currentTarget.classList.add('p-8');
          }}
        />
      );
    } else if (url.toLowerCase().endsWith('.pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else if (url.toLowerCase().match(/\.(docx?|rtf)$/)) {
      return <FileText className="h-12 w-12 text-blue-500" />;
    } else if (url.toLowerCase().match(/\.(xlsx?|csv)$/)) {
      return <FileText className="h-12 w-12 text-green-500" />;
    } else {
      return <ImageIcon className="h-12 w-12 text-gray-500" />;
    }
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {anexos.map((fileUrl, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-28 bg-gray-100 flex items-center justify-center p-2">
                {getFileComponent(fileUrl)}
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
                <p className="text-xs font-medium text-gray-700 truncate" title={fileUrl}>
                  {getShortenedFileName(fileUrl)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
