
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Demanda } from '../types';

interface DemandaHeaderProps {
  demanda: Demanda;
  onClose: () => void;
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ demanda, onClose }) => {
  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="ghost" 
        className="mr-4 p-2" 
        onClick={onClose}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{demanda.titulo}</h2>
        <p className="text-sm text-gray-500">
          {demanda.area_coordenacao?.descricao}
        </p>
      </div>
    </div>
  );
};

export default DemandaHeader;
