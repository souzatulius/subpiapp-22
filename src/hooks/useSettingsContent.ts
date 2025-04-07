
import { useState } from 'react';

type ContentType = 'profile' | 'notifications' | 'roles' | 'team';

export const useSettingsContent = () => {
  const [activeContent, setActiveContent] = useState<ContentType>('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  
  const handleOptionSelect = (option: string) => {
    setActiveContent(option as ContentType);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return {
    activeContent,
    isMenuOpen,
    handleOptionSelect,
    toggleMenu
  };
};

export default useSettingsContent;
