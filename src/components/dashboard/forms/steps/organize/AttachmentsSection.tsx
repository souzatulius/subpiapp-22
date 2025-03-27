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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {anexos.map((anexo, index) => (
            <div key={index} className="flex items-center p-2 border rounded-xl bg-gray-50 gap-2">
              {anexo.match(/\.(png|jpe?g|heic)$/i) ? (
                <img src={anexo} alt="thumbnail" className="w-10 h-10 object-cover rounded-md" />
              ) : (
                <FileText className="w-8 h-8 text-gray-500" />
              )}
              <div className="truncate flex-1">{anexo.split('/').pop()}</div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeAnexo(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
