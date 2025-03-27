
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
  // Validação melhorada para garantir que os anexos sejam exibidos corretamente
  const hasAttachments = () => {
    // Verifica se tem arquivo_url
    if (arquivo_url) return true;
    
    // Verifica se tem anexos
    if (!anexos) return false;
    
    // Se anexos for uma string, tenta converter
    if (typeof anexos === 'string') {
      try {
        const parsed = JSON.parse(anexos);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }
    
    // Se anexos for um array, verifica se tem elementos
    if (Array.isArray(anexos)) {
      return anexos.length > 0 && anexos.some(anexo => anexo);
    }
    
    return false;
  };
  
  // Normaliza os anexos para garantir que sempre temos um array
  const normalizeAttachments = () => {
    if (!anexos) return [];
    
    if (typeof anexos === 'string') {
      try {
        const parsed = JSON.parse(anexos);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    
    if (Array.isArray(anexos)) {
      return anexos.filter(anexo => anexo);
    }
    
    return [];
  };
  
  if (!hasAttachments()) {
    return null;
  }

  const normalizedAttachments = normalizeAttachments();

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
