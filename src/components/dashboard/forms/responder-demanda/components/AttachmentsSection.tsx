
import React, { useMemo } from 'react';
import { FileIcon, ExternalLink, Download, Image, FileText, File, FileSpreadsheet as FileSS, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AttachmentItem from './AttachmentItem';
import { isValidPublicUrl } from '@/utils/questionFormatUtils';

interface AttachmentsSectionProps {
  arquivo_url: string | null;
  anexos: string[] | null;
  onViewAttachment: (url: string) => void;
  onDownloadAttachment: (url: string) => void;
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

    // Process anexos based on type
    if (anexos) {
      if (Array.isArray(anexos)) {
        validUrls.push(...anexos.filter(anexo => 
          anexo && typeof anexo === 'string' && isValidPublicUrl(anexo)
        ));
      } else if (typeof anexos === 'string') {
        try {
          const parsed = JSON.parse(anexos);
          if (Array.isArray(parsed)) {
            validUrls.push(...parsed.filter(anexo => 
              anexo && typeof anexo === 'string' && isValidPublicUrl(anexo)
            ));
          } else if (isValidPublicUrl(anexos)) {
            validUrls.push(anexos);
          }
        } catch (e) {
          // If not valid JSON but a valid URL, use as single attachment
          if (isValidPublicUrl(anexos)) {
            validUrls.push(anexos);
          }
        }
      }
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

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="mb-2 text-sm text-gray-600 font-medium">
        {normalizedAttachments.length} {normalizedAttachments.length === 1 ? 'arquivo anexado' : 'arquivos anexados'}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {normalizedAttachments.map((url: string, index: number) => (
          <AttachmentItem 
            key={`attachment-${index}`}
            url={url} 
            onView={onViewAttachment} 
            onDownload={onDownloadAttachment}
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentsSection;
