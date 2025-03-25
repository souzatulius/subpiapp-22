
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export interface AvatarDisplayProps {
  nome?: string;
  imageSrc?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  nome = '',
  imageSrc,
  size = 'md',
  className = ''
}) => {
  const getInitials = (name: string): string => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-xl'
  };
  
  const initials = getInitials(nome);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={imageSrc} alt={nome} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials || <User className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarDisplay;
