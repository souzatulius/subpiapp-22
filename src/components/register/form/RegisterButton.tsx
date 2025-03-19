
import React from 'react';
import { UserPlus } from 'lucide-react';

interface RegisterButtonProps {
  isLoading: boolean;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <button 
        type="button" 
        className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-2xl opacity-75 cursor-not-allowed"
        disabled
      >
        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
        Processando...
      </button>
    );
  }

  return (
    <button 
      type="submit" 
      className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-2xl"
    >
      <UserPlus className="mr-2 h-5 w-5" /> Cadastrar
    </button>
  );
};

export default RegisterButton;
