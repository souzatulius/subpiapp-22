import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegisterButtonProps {
  isLoading: boolean;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ isLoading }) => {
  return (
    <Button
      type="submit"
      variant="default"
      size="simple"
      className="w-full flex items-center justify-center"
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
          Processando...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-5 w-5" />
          Cadastrar
        </>
      )}
    </Button>
  );
};

export default RegisterButton;
