
import React, { useMemo } from 'react';
import { FileIcon, FileText, FileImage, FileArchive, FileAudio, FileVideo } from 'lucide-react';
import { isValidPublicUrl, processFileUrls } from '@/utils/questionFormatUtils';

interface AttachmentsSectionProps {
  arquivo_url: string | null;
  anexos: string[] | null;
  onViewAttachment?: (url: string) => void;
  onDownloadAttachment?: (url: string) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  arquivo_url,
  anexos,
  onViewAttachment,
  onDownloadAttachment
}) => {
  console.log('AttachmentsSection input:', { arquivo_url, anexos });
  
  // Use useMemo to normalize attachments for better performance
  const normalizedAttachments = useMemo(() => {
    const validUrls: string[] = [];

    // Add arquivo_url if valid
    if (arquivo_url && typeof arquivo_url === 'string' && isValidPublicUrl(arquivo_url)) {
      validUrls.push(arquivo_url);
    }

    // Process anexos array
    const processedAnexos = processFileUrls(anexos);
    if (processedAnexos.length > 0) {
      validUrls.push(...processedAnexos);
    }
    
    console.log('Normalized attachments:', validUrls);
    return validUrls;
  }, [arquivo_url, anexos]);
  
  // Check if we have any valid attachments
  const hasAttachments = normalizedAttachments.length > 0;
  
  if (!hasAttachments) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200">
        <p className="text-gray-500">Não há anexos para esta demanda.</p>
      </div>
    );
  }

  const renderAttachmentIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <FileImage className="h-12 w-12 text-orange-500" />;
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return <FileAudio className="h-12 w-12 text-orange-500" />;
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension || '')) {
      return <FileVideo className="h-12 w-12 text-orange-500" />;
    } else if (['zip', 'rar', '7z'].includes(extension || '')) {
      return <FileArchive className="h-12 w-12 text-orange-500" />;
    } else if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(extension || '')) {
      return <FileText className="h-12 w-12 text-orange-500" />;
    } else {
      return <FileIcon className="h-12 w-12 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="mb-2 text-sm text-gray-600 font-medium">
        Anexos
      </div>
      
      <div className="flex flex-wrap gap-6">
        {normalizedAttachments.map((url: string, index: number) => {
          const filename = url.split('/').pop() || `Anexo ${index + 1}`;
          
          return (
            <a 
              key={`attachment-${index}`}
              href={url}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center transition-transform hover:scale-105"
              onClick={(e) => {
                if (onViewAttachment) {
                  e.preventDefault();
                  onViewAttachment(url);
                }
              }}
            >
              {renderAttachmentIcon(filename)}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AttachmentsSection;
