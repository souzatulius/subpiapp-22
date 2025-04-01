
import React, { useCallback, useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, ImageIcon, FileImage, File } from 'lucide-react';
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
  const [fileDetails, setFileDetails] = useState<{[url: string]: {name: string, type: string}}>({});

  // Load file metadata for existing anexos on component mount
  useEffect(() => {
    const loadFileDetails = async () => {
      const details: {[url: string]: {name: string, type: string}} = {};
      
      for (const url of anexos) {
        try {
          const fileName = decodeURIComponent(url.split('/').pop() || '');
          const fileType = getFileTypeFromFileName(fileName);
          details[url] = { name: fileName, type: fileType };
        } catch (error) {
          console.error('Error parsing file URL:', error);
        }
      }
      
      setFileDetails(prev => ({...prev, ...details}));
    };
    
    loadFileDetails();
  }, [anexos]);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFileDetails: {[url: string]: {name: string, type: string}} = {};
    const newUrls: string[] = [];

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: 'Formato inválido',
          description: 'Permitido apenas: PNG, JPG, HEIC, PDF, DOC ou XLS.',
          variant: 'destructive'
        });
        continue;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: `Máximo permitido: ${MAX_SIZE_MB}MB.`,
          variant: 'destructive'
        });
        continue;
      }

      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('demand_attachments').upload(filePath, file);

      if (error) {
        console.error('Erro ao fazer upload:', error);
        toast({
          title: 'Erro no upload',
          description: error.message,
          variant: 'destructive'
        });
        continue;
      }

      const { data } = supabase.storage.from('demand_attachments').getPublicUrl(filePath);
      const newUrl = data.publicUrl;
      newUrls.push(newUrl);
      
      // Store file details
      newFileDetails[newUrl] = {
        name: file.name,
        type: file.type
      };
    }

    if (newUrls.length > 0) {
      onAnexosChange([...anexos, ...newUrls]);
      setFileDetails(prev => ({...prev, ...newFileDetails}));
      toast({ title: 'Arquivo anexado com sucesso!' });
    }
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
  const getShortenedFileName = (url: string): string => {
    // First try to get from stored details
    if (fileDetails[url]?.name) {
      const name = fileDetails[url].name;
      if (name.length <= 15) return name;
      const ext = name.split('.').pop() || '';
      return `${name.substring(0, 10)}...${ext ? `.${ext}` : ''}`;
    }
    
    // Fallback to URL parsing
    const fileName = decodeURIComponent(url.split('/').pop() || '');
    if (fileName.length <= 15) return fileName;
    
    const fileExt = fileName.split('.').pop() || '';
    return `${fileName.substring(0, 10)}...${fileExt ? `.${fileExt}` : ''}`;
  };

  // Determine if a file is an image by its MIME type or file extension
  const isImageFile = (url: string): boolean => {
    // First try to check by stored file details
    if (fileDetails[url]?.type?.startsWith('image/')) {
      return true;
    }
    
    // Fallback: check by file extension
    return /\.(jpg|jpeg|png|gif|bmp|webp|heic|svg)$/i.test(url);
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

  // Get file icon based on type
  const getFileIcon = (url: string) => {
    const fileType = fileDetails[url]?.type || '';
    
    if (fileType.startsWith('image/') || isImageFile(url)) {
      return <FileImage className="h-8 w-8 text-blue-400" />;
    } else if (fileType.includes('pdf')) {
      return <File className="h-8 w-8 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileText className="h-8 w-8 text-green-600" />;
    }
    
    return <FileText className="h-8 w-8 text-gray-500" />;
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
          multiple
        />
      </div>

      {anexos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {anexos.map((anexo, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-32 bg-gray-100 flex items-center justify-center p-2">
                {isImageFile(anexo) ? (
                  // Display actual image thumbnail for image files
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={anexo} 
                      alt="thumbnail" 
                      className="max-h-full max-w-full object-contain rounded"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                ) : (
                  // Display appropriate icon for non-image files
                  <div className="flex flex-col items-center justify-center p-2">
                    {getFileIcon(anexo)}
                    <span className="text-xs text-gray-500 mt-1">
                      {anexo.toLowerCase().endsWith('.pdf') ? 'PDF' : 
                       anexo.toLowerCase().endsWith('.doc') || anexo.toLowerCase().endsWith('.docx') ? 'DOC' :
                       anexo.toLowerCase().endsWith('.xls') || anexo.toLowerCase().endsWith('.xlsx') ? 'XLS' :
                       'Arquivo'}
                    </span>
                  </div>
                )}
                
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeAnexo(index)}
                  className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-1 bg-white/80 hover:bg-white rounded-full h-6 w-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-medium text-gray-700 truncate" title={fileDetails[anexo]?.name || decodeURIComponent(anexo.split('/').pop() || '')}>
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
