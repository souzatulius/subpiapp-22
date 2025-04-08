
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

interface ProcessoListEmptyProps {
  searchTerm?: string;
  onCreateClick?: () => void;
}

const ProcessoListEmpty: React.FC<ProcessoListEmptyProps> = ({ 
  searchTerm = '',
  onCreateClick 
}) => {
  const navigate = useNavigate();
  
  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      navigate('/dashboard/esic?screen=create');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FilePlus className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">Nenhum processo encontrado</h3>
      <p className="text-gray-500 mb-4">
        {searchTerm ? 'Tente ajustar os critérios de busca' : 'Não há processos cadastrados'}
      </p>
      <Button onClick={handleCreateClick}>
        <FilePlus className="h-4 w-4 mr-2" />
        Novo Processo
      </Button>
    </div>
  );
};

export default ProcessoListEmpty;
