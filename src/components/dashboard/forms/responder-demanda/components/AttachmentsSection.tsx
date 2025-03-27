
import React from 'react';
import { FileIcon, ExternalLink, Download } from 'lucide-react';
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
  
  // Enhanced validation to ensure attachments are displayed correctly
  const hasAttachments = () => {
    // Check if there's a valid arquivo_url
    if (arquivo_url && typeof arquivo_url === 'string' && isValidPublicUrl(arquivo_url)) return true;
    
    // Check if there are anexos
    if (!anexos) return false;
    
    // If anexos is a string, try to parse it
    if (typeof anexos === 'string') {
      try {
        const parsed = JSON.parse(anexos);
        return Array.isArray(parsed) && parsed.length > 0 && parsed.some(anexo => 
          anexo && typeof anexo === 'string' && isValidPublicUrl(anexo)
        );
      } catch {
        return isValidPublicUrl(anexos);
      }
    }
    
    // If anexos is an array, check if it has valid elements
    if (Array.isArray(anexos)) {
      return anexos.length > 0 && anexos.some(anexo => 
        anexo && typeof anexo === 'string' && isValidPublicUrl(anexo)
      );
    }
    
    return false;
  };
  
  // Normalize the anexos to ensure we always have a valid array
  const normalizeAttachments = () => {
    if (!anexos) return [];
    
    if (typeof anexos === 'string') {
      try {
        const parsed = JSON.parse(anexos);
        return Array.isArray(parsed) 
          ? parsed.filter(anexo => anexo && typeof anexo === 'string' && isValidPublicUrl(anexo)) 
          : [anexos].filter(anexo => isValidPublicUrl(anexo));
      } catch {
        return isValidPublicUrl(anexos) ? [anexos] : [];
      }
    }
    
    if (Array.isArray(anexos)) {
      return anexos.filter(anexo => anexo && typeof anexo === 'string' && isValidPublicUrl(anexo));
    }
    
    return [];
  };
  
  const normalizedAttachments = normalizeAttachments();
  
  console.log('Normalized attachments:', normalizedAttachments);
  
  if (!hasAttachments() && (!arquivo_url || !isValidPublicUrl(arquivo_url))) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200">
        <p className="text-gray-500">Não há anexos para esta demanda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="space-y-2">
        {arquivo_url && isValidPublicUrl(arquivo_url) && (
          <AttachmentItem 
            url={arquivo_url} 
            onView={onViewAttachment} 
            onDownload={onDownloadAttachment} 
          />
        )}
        
        {normalizedAttachments.map((anexo: string, index: number) => (
          <AttachmentItem 
            key={index} 
            url={anexo} 
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
