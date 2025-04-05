import React from 'react';
import { Button } from '@/components/ui/button';
import { MediaType } from '@/hooks/useMediaTypes';
import { useMediaTypeIcon } from '@/hooks/useMediaTypeIcon';

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
  const icon = useMediaTypeIcon(mediaType);

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="simple"
      className={`
        h-24 w-full flex flex-col items-center justify-center gap-2 
        rounded-2xl transition-all
        ${isSelected ? "bg-[#003570] text-white" : "hover:bg-orange-500 hover:text-white"}
      `}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {icon}
      <span className="text-sm font-semibold text-center">
        {mediaType.descricao}
      </span>
    </Button>
  );
};

export default MediaTypeButton;
