import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  destination?: string;
  className?: string;
  title?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  destination, 
  className,
  title = "Voltar",
  onClick
}) => {
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
      className={`absolute top-6 left-6 z-10 ${className || ''}`}
      aria-label={title}
      title={title}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
