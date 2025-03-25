
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

// Types for AvatarDisplay
interface AvatarDisplayProps {
  name: string; // Changed from userName
  imageUrl?: string; // Changed from photoUrl
  size?: 'sm' | 'md' | 'lg';
}

// Avatar display component
const AvatarDisplay = ({ name, imageUrl, size = 'md' }: AvatarDisplayProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário';
  const photoUrl = user.user_metadata?.avatar_url || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto">
          <AvatarDisplay 
            name={userName} 
            imageUrl={photoUrl} 
            size="md" 
          />
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
