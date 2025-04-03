
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarDisplayProps {
  nome: string;
  imageSrc?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showNotificationCount?: boolean;
  notificationCount?: number;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  nome,
  imageSrc,
  size = 'md',
  className,
  showNotificationCount = false,
  notificationCount = 0
}) => {
  // Obter as iniciais do nome
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-xl',
  };

  const avatarSize = sizeClasses[size];
  const initials = getInitials(nome);

  return (
    <div className="relative">
      <Avatar className={cn(avatarSize, className)}>
        {imageSrc ? (
          <AvatarImage src={imageSrc} alt={nome || 'Usuário'} />
        ) : (
          <AvatarFallback className="bg-[#003570] hover:bg-orange-500 transition-colors font-semibold text-white">
            <span className="text-lg">{initials}</span>
          </AvatarFallback>
        )}
      </Avatar>
      
      {showNotificationCount && notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
          {notificationCount > 9 ? '9+' : notificationCount}
        </span>
      )}
    </div>
  );
};

export default AvatarDisplay;
