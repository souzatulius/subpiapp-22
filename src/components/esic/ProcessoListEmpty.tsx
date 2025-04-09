
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessoListEmptyProps {
  searchTerm?: string;
}

const ProcessoListEmpty: React.FC<ProcessoListEmptyProps> = ({ searchTerm }) => {
  return (
    <Card className="border-dashed border-2 border-gray-200 rounded-xl">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-gray-100 p-3 rounded-full">
          <FileQuestion className="h-8 w-8 text-gray-400" />
        </div>
        
        {searchTerm ? (
          <div className="space-y-1">
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-sm text-gray-500">
              Não encontramos processos correspondentes a "<span className="font-medium">{searchTerm}</span>".
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-lg font-medium">Nenhum processo</p>
            <p className="text-sm text-gray-500">
              Não existem processos e-SIC cadastrados no momento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessoListEmpty;
