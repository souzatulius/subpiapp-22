
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarDisplayProps {
  nome: string;
  imageSrc?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  nome, 
  imageSrc, 
  size = 'md',
  className = ''
}) => {
  const [imageKey, setImageKey] = useState<number>(Date.now());
  
  // Efeito para recarregar a imagem quando ela for atualizada
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage event detected, refreshing avatar');
      setImageKey(Date.now()); // Força a recarga da imagem
    };
    
    const handlePhotoUpdated = () => {
      console.log('Photo updated event detected, refreshing avatar');
      setImageKey(Date.now()); // Força a recarga da imagem
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile:photo:updated', handlePhotoUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile:photo:updated', handlePhotoUpdated);
    };
  }, []);

  // Generate initials from name
  const getInitials = (name: string): string => {
    if (!name) return '??';
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get avatar size class
  const getSizeClass = (): string => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-xs';
      case 'md': return 'h-10 w-10 text-sm';
      case 'lg': return 'h-14 w-14 text-lg';
      case 'xl': return 'h-24 w-24 text-2xl';
      default: return 'h-10 w-10 text-sm';
    }
  };
  
  // Add a timestamp to the image URL to prevent caching issues
  const getImageUrl = (): string => {
    if (!imageSrc) return '';
    
    try {
      const url = new URL(imageSrc);
      url.searchParams.set('t', `${imageKey}`);
      return url.toString();
    } catch (e) {
      // If the URL is invalid, just return the original string with timestamp
      return `${imageSrc}?t=${imageKey}`;
    }
  };

  // For debugging
  useEffect(() => {
    if (imageSrc) {
      console.log('Avatar image source:', getImageUrl());
    }
  }, [imageSrc, imageKey]);

  return (
    <Avatar className={`${getSizeClass()} ${className}`}>
      {imageSrc && (
        <AvatarImage 
          src={getImageUrl()} 
          alt={nome} 
          className="object-cover"
          onError={(e) => {
            console.error('Avatar image failed to load:', e);
            // The AvatarFallback will be shown automatically
          }}
        />
      )}
      <AvatarFallback className="bg-orange-100 text-subpi-blue">
        {getInitials(nome)}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarDisplay;
