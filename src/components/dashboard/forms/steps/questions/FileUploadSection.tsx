
import React, { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Trash2, X, ImageIcon, Image, FileImage, File } from 'lucide-react';
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

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const files = Array.from(event.dataTransfer.files);
      if (files.length === 0) return;
      await uploadFiles(files);
    }, 
  []);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const newUrls: string[] = [];
    const newFileDetails: {[url: string]: {name: string, type: string}} = {};
    
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
        
        const fileExt = file.name.split('.').pop() || '';
        const fileName = `${uuidv4()}-${file.name}`;
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
        
        // Store URL and file details
        const urlWithMeta = data.publicUrl;
        newUrls.push(urlWithMeta);
        
        // Store file details for the new URL
        newFileDetails[urlWithMeta] = { 
          name: file.name, 
          type: file.type 
        };
      }
      
      if (newUrls.length > 0) {
        onAnexosChange([...anexos, ...newUrls]);
        setFileDetails(prev => ({...prev, ...newFileDetails}));
        
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
                <div className="relative h-32 bg-gray-100 flex items-center justify-center p-2">
                  {isImageFile(fileUrl) ? (
                    // Display actual image thumbnail for image files
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                        src={fileUrl} 
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
                      {getFileIcon(fileUrl)}
                      <span className="text-xs text-gray-500 mt-1">
                        {fileUrl.toLowerCase().endsWith('.pdf') ? 'PDF' : 
                         fileUrl.toLowerCase().endsWith('.doc') || fileUrl.toLowerCase().endsWith('.docx') ? 'DOC' :
                         fileUrl.toLowerCase().endsWith('.xls') || fileUrl.toLowerCase().endsWith('.xlsx') ? 'XLS' :
                         'Arquivo'}
                      </span>
                    </div>
                  )}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-1 bg-white/80 hover:bg-white rounded-full h-6 w-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium text-gray-700 truncate" title={fileDetails[fileUrl]?.name || decodeURIComponent(fileUrl.split('/').pop() || '')}>
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
