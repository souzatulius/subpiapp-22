
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

interface NovoProcessoButtonProps {
  onSuccess?: () => void;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'action';
}

const NovoProcessoButton: React.FC<NovoProcessoButtonProps> = ({ 
  onSuccess, 
  buttonText = "Novo Processo", 
  variant = "action" 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    navigate('/esic/create');
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 300);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      disabled={isLoading}
      className="gap-2"
    >
      <FilePlus className="h-5 w-5" />
      {buttonText}
    </Button>
  );
};

export default NovoProcessoButton;
