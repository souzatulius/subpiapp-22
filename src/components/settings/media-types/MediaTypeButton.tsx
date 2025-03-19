
import React from 'react';
import { Button } from '@/components/ui/button';
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
  File
} from 'lucide-react';
import { MediaType } from '@/hooks/useMediaTypes';

interface MediaTypeButtonProps {
  mediaType: MediaType;
  isSelected: boolean;
  onClick: () => void;
}

const MediaTypeButton: React.FC<MediaTypeButtonProps> = ({
  mediaType,
  isSelected,
  onClick
}) => {
  // Function to get the appropriate icon based on media type description
  const getIcon = () => {
    const description = mediaType.descricao.toLowerCase();
    
    if (description.includes('vídeo')) return <Video className="h-8 w-8" />;
    if (description.includes('imagem') || description.includes('foto')) return <Image className="h-8 w-8" />;
    if (description.includes('áudio') || description.includes('audio')) return <Music className="h-8 w-8" />;
    if (description.includes('jornal')) return <Newspaper className="h-8 w-8" />;
    if (description.includes('documento') || description.includes('pdf')) return <FileText className="h-8 w-8" />;
    if (description.includes('rádio') || description.includes('radio')) return <Radio className="h-8 w-8" />;
    if (description.includes('tv') || description.includes('televisão')) return <Tv className="h-8 w-8" />;
    if (description.includes('youtube') || description.includes('vídeo online')) return <Youtube className="h-8 w-8" />;
    if (description.includes('rede') || description.includes('social')) return <MessageSquare className="h-8 w-8" />;
    
    // Default icon
    return <File className="h-8 w-8" />;
  };

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={`h-24 w-full py-3 flex flex-col items-center justify-center gap-2 rounded-lg 
        ${isSelected ? "ring-2 ring-[#003570] bg-[#003570] text-white" : "hover:bg-gray-100"}
      `}
      onClick={onClick}
    >
      {getIcon()}
      <span className="text-sm font-semibold text-center">{mediaType.descricao}</span>
    </Button>
  );
};

export default MediaTypeButton;
