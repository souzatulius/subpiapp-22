import React, { useCallback, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  onChange: (url: string) => void;
  value?: string;
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

const FileUpload: React.FC<FileUploadProps> = ({ onChange, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleUpload = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Formato inválido',
        description: 'Só é permitido PNG, JPG, HEIC, PDF, DOC ou XLS.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: `O arquivo deve ter até ${MAX_SIZE_MB}MB.`,
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    const filePath = `uploads/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from('demandas').upload(filePath, file);

    if (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive'
      });
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('demandas').getPublicUrl(filePath);
    onChange(data.publicUrl);

    toast({ title: 'Arquivo anexado com sucesso!' });
    setIsUploading(false);
  };

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) await handleUpload(file);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await handleUpload(file);
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
  };

  const getIcon = () => {
    if (value?.match(/\.(png|jpe?g|heic)$/i)) {
      return <img src={value} alt="preview" className="w-10 h-10 object-cover rounded" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="w-full">
      <Label>Anexar Arquivo</Label>

      {value ? (
        <div className="mt-2 flex items-center gap-2 p-2 border border-gray-300 rounded-lg">
          {getIcon()}
          <span className="text-sm text-gray-700 flex-1 truncate">
            {fileName || decodeURIComponent(value.split('/').pop() || '')}
          </span>
          <button onClick={handleRemove} className="hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragging ? 'bg-blue-50 border-blue-400' : 'border-gray-300'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isUploading ? 'Enviando arquivo...' : 'Clique aqui ou arraste um arquivo'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, HEIC, PDF, DOC, XLS até 10MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleFileChange}
        accept={ACCEPTED_TYPES.join(',')}
      />
    </div>
  );
};

export default FileUpload;
