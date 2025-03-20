
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileIcon, SearchIcon } from 'lucide-react';

const NoDataMessage = () => {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <SearchIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sem dados para exibir</h3>
        <p className="text-gray-500 text-center max-w-md">
          Não foram encontrados dados para os filtros selecionados. Tente modificar seus filtros ou verifique se há demandas cadastradas no sistema.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoDataMessage;
