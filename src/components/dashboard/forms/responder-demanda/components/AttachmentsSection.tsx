
import React, { useMemo, useState } from 'react';
import { FileIcon, FileText, FileImage, FileArchive, FileAudio, FileVideo, AlertTriangle } from 'lucide-react';
import { isValidPublicUrl, processFileUrls } from '@/utils/questionFormatUtils';
import { toast } from '@/components/ui/use-toast';

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
  const [errorUrls, setErrorUrls] = useState<Set<string>>(new Set());
  
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

  const handleAttachmentError = (url: string) => {
    setErrorUrls(prev => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
    console.error(`Error loading attachment: ${url}`);
    
    // Only show toast for the first error to avoid spamming
    if (!errorUrls.has(url)) {
      toast({
        title: "Erro ao carregar anexo",
        description: "Não foi possível acessar o arquivo. Verifique se o bucket 'demandas' existe no Supabase.",
        variant: "destructive"
      });
    }
  };

  const renderAttachmentIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'jfif'].includes(extension || '')) {
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
          const hasError = errorUrls.has(url);
          
          return (
            <a 
              key={`attachment-${index}`}
              href={url}
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex flex-col items-center transition-transform ${hasError ? 'opacity-60' : 'hover:scale-105'}`}
              onClick={(e) => {
                if (hasError) {
                  e.preventDefault();
                  toast({
                    title: "Anexo indisponível",
                    description: "Não foi possível acessar este anexo. Verifique se o bucket 'demandas' existe no Supabase.",
                    variant: "destructive"
                  });
                  return;
                }
                
                if (onViewAttachment) {
                  e.preventDefault();
                  onViewAttachment(url);
                }
              }}
            >
              {hasError ? (
                <div className="h-12 w-12 flex items-center justify-center bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              ) : (
                renderAttachmentIcon(filename)
              )}
              
              <span className="text-sm text-gray-600 mt-2 text-center max-w-[120px] truncate">
                {decodeURIComponent(filename)}
              </span>
              
              {hasError && (
                <span className="text-xs text-red-500 mt-1">
                  Anexo indisponível
                </span>
              )}
              
              {/* Add invisible image to check if URL is valid */}
              {!hasError && (
                <img 
                  src={url} 
                  alt="" 
                  className="hidden"
                  onError={() => handleAttachmentError(url)}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AttachmentsSection;
