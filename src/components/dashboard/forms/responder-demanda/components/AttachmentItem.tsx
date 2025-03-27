
import React from 'react';
import { FileIcon, ExternalLink, Download, Image, FileText, Video, Music, Archive } from 'lucide-react';
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
  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split('/');
      const fileName = segments[segments.length - 1];
      
      // Try to decode URI component (handle special characters)
      try {
        return decodeURIComponent(fileName);
      } catch {
        return fileName;
      }
    } catch {
      return `Arquivo ${index !== undefined ? index + 1 : ''}`;
    }
  };
  
  const getFileIcon = () => {
    const fileName = getFileName(url).toLowerCase();
    const extension = fileName.split('.').pop();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-600" />;
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

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {getFileIcon()}
        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px] md:max-w-[400px]">
          {getFileName(url)}
        </span>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(url)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Visualizar</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(url)}
          className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Baixar</span>
        </Button>
      </div>
    </div>
  );
};

export default AttachmentItem;
