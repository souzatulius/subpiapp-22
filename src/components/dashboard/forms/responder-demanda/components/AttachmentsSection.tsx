
import React from 'react';
import { FileIcon, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AttachmentItem from './AttachmentItem';

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
  if (!arquivo_url && (!anexos || anexos.length === 0)) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3 animate-fade-in">
      <h3 className="text-base font-medium text-subpi-blue">Anexos</h3>
      <div className="space-y-2">
        {arquivo_url && (
          <AttachmentItem 
            url={arquivo_url} 
            onView={onViewAttachment} 
            onDownload={onDownloadAttachment} 
          />
        )}
        
        {anexos && anexos.map((anexo: string, index: number) => (
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
