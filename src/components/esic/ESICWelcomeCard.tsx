
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

interface ESICWelcomeCardProps {}

const ESICWelcomeCard: React.FC<ESICWelcomeCardProps> = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-100 via-orange-300 to-gray-500 text-gray-800 shadow-lg overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold mb-2 md:mb-3 flex items-center">
              <FileQuestion className="h-6 w-6 mr-2" />
              Sistema de Informação ao Cidadão (e-SIC)
            </h2>
            <p className="text-gray-700">
              Gerencie solicitações de acesso à informação de forma simples e eficiente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESICWelcomeCard;
