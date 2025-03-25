
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarDisplayProps } from './types';
import { UserProfile } from '@/types/common';

interface ExtendedAvatarDisplayProps extends AvatarDisplayProps {
  userProfile?: UserProfile;
  previewUrl?: string;
}

// This component can accept both old and new prop patterns for compatibility
const AvatarDisplay: React.FC<ExtendedAvatarDisplayProps> = ({
  nome,
  imageSrc,
  size = 'md',
  className = '',
  userProfile,
  previewUrl
}) => {
  // Support both old and new prop patterns
  const displayName = nome || userProfile?.nome_completo || '';
  const imageSource = previewUrl || imageSrc || userProfile?.foto_perfil_url || userProfile?.avatar_url || '';

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(displayName);
  
  const sizeClasses = {
    'sm': 'h-8 w-8 text-xs',
    'md': 'h-10 w-10 text-sm',
    'lg': 'h-16 w-16 text-lg',
    'xl': 'h-24 w-24 text-xl'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={imageSource} alt={displayName} />
      <AvatarFallback className="bg-indigo-100 text-indigo-700">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarDisplay;
