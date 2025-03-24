
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToConsultar = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };
  
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">✓</div>
      <h3 className="text-lg font-medium text-gray-900">Nenhuma demanda pendente</h3>
      <p className="mt-2 text-sm text-gray-500">
        Não há demandas pendentes para resposta com os filtros selecionados.
      </p>
      <div className="mt-6">
        <Button onClick={handleNavigateToConsultar} variant="outline">
          Consultar Todas as Demandas
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
