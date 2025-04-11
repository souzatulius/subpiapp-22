import React from 'react';
import { FileIcon, ExternalLink, Download, Image, FileText, File, FileSpreadsheet as FileSS, Music, Video, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentItemProps {
  url: string;
  onView: (url: string) => void;
  onDownload: (url: string) => void;
  index?: number;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  url,
  onView,
  onDownload,
  index
}) => {
  // Improved filename extraction with better error handling
  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split('/');
      let fileName = segments[segments.length - 1];
      
      // Try to decode URI component (handle special characters)
      try {
        fileName = decodeURIComponent(fileName);
      } catch {
        return fileName;
      }
      
      // If the filename is a UUID or looks like one, try to get a more readable name
      if (fileName.length > 30 && fileName.includes('-')) {
        return `Arquivo ${index !== undefined ? index + 1 : ''}`;
      }
      
      return fileName;
    } catch {
      return `Arquivo ${index !== undefined ? index + 1 : ''}`;
    }
  };
  
  const getFileIcon = () => {
    const fileName = getFileName(url).toLowerCase();
    const extension = fileName.split('.').pop();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    } else if (['pdf'].includes(extension || '')) {
      return <File className="h-5 w-5 text-red-600" />; // Changed from FilePdf to File
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-blue-600" />; // Using FileText for doc/docx
    } else if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return <FileSS className="h-5 w-5 text-green-600" />; // Using alias FileSS
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) {
      return <Video className="h-5 w-5 text-purple-600" />;
    } else if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension || '')) {
      return <Music className="h-5 w-5 text-green-600" />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <Archive className="h-5 w-5 text-orange-600" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const isImage = () => {
    const fileName = getFileName(url).toLowerCase();
    const extension = fileName.split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '');
  };

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {isImage() ? (
        <div className="h-32 overflow-hidden bg-gray-100 border-b border-gray-200">
          <img 
            src={url} 
            alt={getFileName(url)}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null; 
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyQzIgMTcuNTIyOCA2LjQ3NzE1IDIyIDEyIDIyWiIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTE1IDlMOSAxNSIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTkgOUwxNSAxNSIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+';
              e.currentTarget.classList.add('p-8');
            }}
          />
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50">
          <div className="scale-150">
            {getFileIcon()}
          </div>
        </div>
      )}
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          {getFileIcon()}
          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
            {getFileName(url)}
          </span>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(url)}
            className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Visualizar</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(url)}
            className="flex-1 flex items-center justify-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">Baixar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentItem;
