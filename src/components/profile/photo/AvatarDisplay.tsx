
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarDisplayProps {
  nome: string;
  imageSrc?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ nome, imageSrc, size = 'md' }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getSizeClasses = (size: string) => {
    switch(size) {
      case 'xs': return 'h-6 w-6 text-xs';
      case 'sm': return 'h-8 w-8 text-sm';
      case 'md': return 'h-10 w-10 text-base';
      case 'lg': return 'h-12 w-12 text-lg';
      case 'xl': return 'h-16 w-16 text-xl';
      default: return 'h-10 w-10 text-base';
    }
  };
  
  const sizeClasses = getSizeClasses(size);
  
  return (
    <Avatar className={`${sizeClasses}`}>
      {imageSrc ? (
        <AvatarImage src={imageSrc} alt={nome} />
      ) : (
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {getInitials(nome)}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default AvatarDisplay;
