
import React from 'react';
import { 
  Video, 
  Image, 
  Music, 
  FileText, 
  Newspaper, 
  Radio, 
  Tv, 
  Youtube,
  MessageSquare,
  File,
  LucideIcon
} from 'lucide-react';
import { MediaType } from '@/hooks/useMediaTypes';

export const useMediaTypeIcon = (mediaType: MediaType, size: string = "h-8 w-8"): React.ReactElement => {
  // Function to get the appropriate icon based on media type description
  const getIcon = (): React.ReactElement => {
    const description = mediaType.descricao.toLowerCase();
    
    if (description.includes('vídeo')) return <Video className={size} />;
    if (description.includes('imagem') || description.includes('foto')) return <Image className={size} />;
    if (description.includes('áudio') || description.includes('audio')) return <Music className={size} />;
    if (description.includes('jornal')) return <Newspaper className={size} />;
    if (description.includes('documento') || description.includes('pdf')) return <FileText className={size} />;
    if (description.includes('rádio') || description.includes('radio')) return <Radio className={size} />;
    if (description.includes('tv') || description.includes('televisão')) return <Tv className={size} />;
    if (description.includes('youtube') || description.includes('vídeo online')) return <Youtube className={size} />;
    if (description.includes('rede') || description.includes('social')) return <MessageSquare className={size} />;
    
    // Default icon
    return <File className={size} />;
  };

  return getIcon();
};
