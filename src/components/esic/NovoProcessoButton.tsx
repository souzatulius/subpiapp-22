
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NovoProcessoButtonProps {
  onSuccess?: () => void;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "action";
}

const NovoProcessoButton: React.FC<NovoProcessoButtonProps> = ({ 
  onSuccess,
  buttonText = "Novo Processo",
  variant = "action"
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard/esic?screen=create');
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      className="items-center"
    >
      <FilePlus className="h-5 w-5 mr-2" />
      {buttonText}
    </Button>
  );
};

export default NovoProcessoButton;
