
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, Eye, Download, File } from 'lucide-react';

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
  index = 0 
}) => {
  // Get filename from URL
  const getFileName = (url: string) => {
    if (!url) return 'Arquivo';
    return url.split('/').pop() || 'Arquivo';
  };

  // Helper function to get file extension/type
  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  // Helper to get icon based on file type
  const getFileIcon = (url: string) => {
    const type = getFileType(url);
    switch (type) {
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-300 animate-fade-in" 
      style={{animationDelay: `${index * 100}ms`}}
    >
      {getFileIcon(url)}
      <span className="ml-2 text-sm truncate flex-1">{getFileName(url)}</span>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-subpi-blue hover:text-subpi-blue-dark hover:bg-blue-50 transition-colors duration-300"
          onClick={() => onView(url)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-subpi-blue hover:text-subpi-blue-dark hover:bg-blue-50 transition-colors duration-300"
          onClick={() => onDownload(url)}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AttachmentItem;
