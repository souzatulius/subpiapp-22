
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile } from '../types';

interface AvatarDisplayProps {
  userProfile: UserProfile | null;
  previewUrl: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const getUserInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ userProfile, previewUrl, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-32 w-32 border-4 border-gray-200'
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {previewUrl ? (
        <AvatarImage src={previewUrl} alt="Preview" />
      ) : userProfile?.foto_perfil_url ? (
        <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo} />
      ) : (
        <AvatarFallback className={size === 'lg' ? "text-3xl bg-subpi-blue text-white" : "bg-subpi-blue text-white"}>
          {userProfile?.nome_completo ? getUserInitials(userProfile.nome_completo) : 'U'}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default AvatarDisplay;
