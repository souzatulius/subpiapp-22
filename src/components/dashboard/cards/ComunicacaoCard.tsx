
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface ComunicacaoCardProps {
  className?: string;
}

const ComunicacaoCard: React.FC<ComunicacaoCardProps> = ({ className }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate('/dashboard/comunicacao');
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-gray-100 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center mb-2">
          <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="font-medium">Comunicação</h3>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Acesse o dashboard da comunicação
        </div>
        
        <div className="mt-4 text-xs text-gray-500 flex items-center">
          <PlusCircle className="h-3.5 w-3.5 mr-1 text-blue-500" />
          <span>Gerenciar demandas e notas</span>
        </div>
      </div>
    </div>
  );
};

export default ComunicacaoCard;
