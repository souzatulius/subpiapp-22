
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface AttachmentsSectionProps {
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

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ anexos, onAnexosChange }) => {

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Formato inválido',
        description: 'Permitido apenas: PNG, JPG, HEIC, PDF, DOC ou XLS.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: `Máximo permitido: ${MAX_SIZE_MB}MB.`,
        variant: 'destructive'
      });
      return;
    }

    const ext = file.name.split('.').pop();
    const filePath = `uploads/${uuidv4()}.${ext}`;

    const { error } = await supabase.storage.from('demand_attachments').upload(filePath, file);

    if (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    const { data } = supabase.storage.from('demand_attachments').getPublicUrl(filePath);
    const newUrl = data.publicUrl;

    onAnexosChange([...anexos, newUrl]);
    toast({ title: 'Arquivo anexado com sucesso!' });
  }, [anexos, onAnexosChange]);

  const removeAnexo = (index: number) => {
    const newAnexos = anexos.filter((_, i) => i !== index);
    onAnexosChange(newAnexos);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  // Helper function to get shortened file name
  const getShortenedFileName = (url: string) => {
    const fileName = url.split('/').pop() || '';
    const fileExt = fileName.split('.').pop() || '';
    
    if (fileName.length <= 12) return fileName;
    
    return `${fileName.substring(0, 8)}...${fileExt ? `.${fileExt}` : ''}`;
  };

  // Determine if file is an image
  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|heic)$/i.test(url);
  };

  return (
    <div>
      <Label className="block mb-2">Anexos</Label>

      <div
        className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <div className="text-center text-gray-500">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Clique para enviar ou arraste e solte</p>
          <p className="text-xs">Formatos: PNG, JPG, PDF, DOCX, XLSX (até 10MB)</p>
        </div>

        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {anexos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {anexos.map((anexo, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-24 bg-gray-100 flex items-center justify-center p-2">
                {isImageFile(anexo) ? (
                  <img 
                    src={anexo} 
                    alt="thumbnail" 
                    className="h-full object-contain max-w-full rounded-t-md"
                  />
                ) : (
                  <FileText className="h-10 w-10 text-blue-500" />
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeAnexo(index)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-medium text-gray-700 truncate" title={anexo.split('/').pop()}>
                  {getShortenedFileName(anexo)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
