
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface DemandaDetailsSectionProps {
  detalhes: string | null;
}

const DemandaDetailsSection: React.FC<DemandaDetailsSectionProps> = ({ detalhes }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Detalhes da Solicitação</h3>
      <div className="bg-gray-50 p-4 rounded-md border">
        {detalhes || "Sem detalhes fornecidos"}
      </div>
    </div>
  );
};

export default DemandaDetailsSection;
