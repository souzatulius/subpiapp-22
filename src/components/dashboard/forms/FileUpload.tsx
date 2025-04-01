
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, ImageIcon, File, FileImage } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  // Set file name from URL when value changes
  useEffect(() => {
    if (value) {
      try {
        const name = decodeURIComponent(value.split('/').pop() || '');
        setFileName(name);
        setFileType(getFileTypeFromFileName(name));
      } catch (error) {
        console.error('Error parsing file URL:', error);
      }
    } else {
      setFileName('');
      setFileType('');
    }
  }, [value]);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];
      if (!file) return;
      await handleUpload(file);
    }, []);

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
    setFileType(file.type);

    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `uploads/${fileName}`;

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await handleUpload(file);
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setFileType('');
  };

  // Is this an image file?
  const isImageFile = () => {
    return fileType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp|heic|svg)$/i.test(value || '');
  };

  // Get proper file type from filename
  const getFileTypeFromFileName = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    
    if (/^(jpg|jpeg|png|gif|bmp|webp|heic|svg)$/i.test(ext)) {
      return `image/${ext}`;
    } else if (ext === 'pdf') {
      return 'application/pdf';
    } else if (['doc', 'docx'].includes(ext)) {
      return 'application/msword';
    } else if (['xls', 'xlsx'].includes(ext)) {
      return 'application/vnd.ms-excel';
    }
    
    return 'application/octet-stream';
  };

  // Get appropriate file icon based on type
  const getFileIcon = () => {
    if (isImageFile()) {
      return <FileImage className="h-8 w-8 text-blue-400" />;
    } else if (fileType?.includes('pdf') || value?.toLowerCase().endsWith('.pdf')) {
      return <File className="h-8 w-8 text-red-500" />;
    } else if (fileType?.includes('word') || fileType?.includes('doc') || 
               value?.toLowerCase().endsWith('.doc') || value?.toLowerCase().endsWith('.docx')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    } else if (fileType?.includes('excel') || fileType?.includes('sheet') ||
               value?.toLowerCase().endsWith('.xls') || value?.toLowerCase().endsWith('.xlsx')) {
      return <FileText className="h-8 w-8 text-green-600" />;
    }
    
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="w-full">
      <Label>Anexar Arquivo</Label>

      {value ? (
        <div className="mt-2 flex flex-col border border-gray-300 rounded-lg overflow-hidden">
          <div className="relative bg-gray-100 p-2 flex justify-center items-center h-32">
            {isImageFile() ? (
              <img 
                src={value} 
                alt="preview" 
                className="max-h-full max-w-full object-contain rounded"
                onError={() => {
                  // Fallback if image fails to load
                  toast({
                    title: "Erro ao carregar imagem",
                    description: "Não foi possível carregar a miniatura da imagem",
                    variant: "destructive"
                  });
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                {getFileIcon()}
                <span className="text-xs text-gray-500 mt-2">
                  {value?.toLowerCase().endsWith('.pdf') ? 'PDF' : 
                  value?.toLowerCase().endsWith('.doc') || value?.toLowerCase().endsWith('.docx') ? 'DOC' :
                  value?.toLowerCase().endsWith('.xls') || value?.toLowerCase().endsWith('.xlsx') ? 'XLS' :
                  'Arquivo'}
                </span>
              </div>
            )}
            
            <button 
              onClick={handleRemove} 
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-2 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-700 flex-1 truncate">
              {fileName || decodeURIComponent(value.split('/').pop() || '')}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragging ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
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
