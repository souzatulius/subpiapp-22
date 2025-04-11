
import React from 'react';
import { X, FileText, Image, File, FilePdf, FileSpreadsheet, FileCode, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadSectionProps {
  anexos: string[];
  onAnexosChange: (anexos: string[]) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ anexos, onAnexosChange }) => {
  const handleRemoveAnexo = (index: number) => {
    const newAnexos = [...anexos];
    newAnexos.splice(index, 1);
    onAnexosChange(newAnexos);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
      return <Image className="h-8 w-8 text-blue-600" />;
    } else if (['pdf'].includes(extension)) {
      return <FilePdf className="h-8 w-8 text-red-600" />;
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <FileText className="h-8 w-8 text-indigo-600" />;
    } else if (['html', 'js', 'ts', 'jsx', 'tsx', 'json'].includes(extension)) {
      return <FileCode className="h-8 w-8 text-yellow-600" />;
    } else {
      return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileName = (fileUrl: string) => {
    // Extract only the filename from the URL or path
    const parts = fileUrl.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  };

  const getFileUrl = (fileUrl: string) => {
    // Determine if it's an object URL, Supabase URL or a regular path
    if (fileUrl.startsWith('blob:')) {
      return fileUrl; // It's already a blob URL
    }
    
    // Handle Supabase Storage URLs
    if (fileUrl.includes('storage.googleapis.com') || fileUrl.includes('supabase.co/storage/v1')) {
      // Make sure URL is properly encoded for Supabase storage
      try {
        return fileUrl; // Return the Supabase URL as is
      } catch (e) {
        console.error('Error with Supabase URL:', e);
        return fileUrl; // Return original even if there's an error
      }
    }
    
    try {
      // Test if it's a valid URL
      new URL(fileUrl);
      return fileUrl;
    } catch (e) {
      // If it's not a valid URL, it might be a relative path
      // Add a base URL if needed
      return fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
    }
  };

  const isImageFile = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="form-question-title">Anexos (opcional)</h3>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="rounded-xl flex items-center gap-1"
          >
            <Paperclip className="h-4 w-4" />
            <span>Anexar arquivo</span>
          </Button>
        </label>
        <input 
          id="file-upload"
          type="file" 
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
              onAnexosChange([...anexos, ...newFiles]);
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {anexos.map((anexo, index) => (
          <div 
            key={index} 
            className="relative border border-gray-200 rounded-xl p-3 flex items-center gap-3 bg-white shadow-sm"
          >
            {isImageFile(anexo) ? (
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded bg-gray-50">
                <img 
                  src={getFileUrl(anexo)} 
                  alt="preview" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Handle image loading error
                    e.currentTarget.onerror = null; 
                    e.currentTarget.style.display = 'none';
                    
                    // Add a fallback icon if the image fails to load
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gray-200');
                      const fallbackIcon = document.createElement('div');
                      fallbackIcon.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      `;
                      parent.appendChild(fallbackIcon);
                    }
                  }}
                />
              </div>
            ) : (
              getFileIcon(anexo)
            )}
            
            <div className="flex-1 overflow-hidden">
              <p className="text-sm truncate">{getFileName(anexo)}</p>
            </div>
            
            <button
              type="button"
              onClick={() => handleRemoveAnexo(index)}
              className="text-gray-500 hover:text-red-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {anexos.length === 0 && (
        <p className="text-gray-500 text-sm italic mt-2">Nenhum arquivo anexado</p>
      )}
    </div>
  );
};

export default FileUploadSection;
