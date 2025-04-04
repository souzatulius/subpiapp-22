
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  destination?: string;
  className?: string;
  title?: string;
  onClick?: () => void;
  hidden?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  destination, 
  className,
  title = "Voltar",
  onClick,
  hidden = false
}) => {
  // If the button is hidden, don't render it at all
  if (hidden) return null;
  
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (destination) {
      navigate(destination);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button 
      variant="action"
      size="icon" 
      onClick={handleClick}
      className={`absolute top-6 left-6 z-10 bg-[#f57737] hover:bg-[#e56726] text-white ${className || ''}`}
      title={title}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
