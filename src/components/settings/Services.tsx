
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Services = () => {
  return (
    <div className="p-6">
      <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle>Serviços Removidos</AlertTitle>
        <AlertDescription>
          A funcionalidade de serviços foi removida do sistema.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Services;
