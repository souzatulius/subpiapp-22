
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarDisplayProps {
  nome: string;
  imageSrc?: string | null; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  nome, 
  imageSrc, 
  size = 'md',
  className = '' 
}) => {
  const [src, setSrc] = useState<string | null>(imageSrc || null);
  const [initials, setInitials] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Generate initials from name
    if (nome) {
      const parts = nome.split(' ').filter(Boolean);
      if (parts.length >= 2) {
        setInitials(`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase());
      } else if (parts.length === 1) {
        setInitials(parts[0].substring(0, 2).toUpperCase());
      } else {
        setInitials('--');
      }
    }

    // Update source if imageSrc changes
    setSrc(imageSrc || null);
  }, [nome, imageSrc]);

  // Listen for profile photo updates
  useEffect(() => {
    const handleProfilePhotoUpdate = () => {
      // Force a refresh of the avatar by updating the key
      setRefreshKey(prev => prev + 1);
      
      // If we have an image URL, append a cache-busting param
      if (imageSrc) {
        const url = new URL(imageSrc);
        url.searchParams.set('t', Date.now().toString());
        setSrc(url.toString());
      }
    };

    window.addEventListener('profile:photo:updated', handleProfilePhotoUpdate);
    
    return () => {
      window.removeEventListener('profile:photo:updated', handleProfilePhotoUpdate);
    };
  }, [imageSrc]);

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`} key={refreshKey}>
      {src && <AvatarImage src={src} alt={nome || 'Avatar do usuário'} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarDisplay;
