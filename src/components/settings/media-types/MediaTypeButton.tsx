
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
  // Use our custom hook to get the icon
  const icon = useMediaTypeIcon(mediaType);

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={`h-24 w-full py-3 flex flex-col items-center justify-center gap-2 rounded-xl selection-button
        ${isSelected ? "bg-orange-500 text-white" : "hover:bg-orange-500 hover:text-white"}
      `}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-semibold text-center">{mediaType.descricao}</span>
    </Button>
  );
};

export default MediaTypeButton;
