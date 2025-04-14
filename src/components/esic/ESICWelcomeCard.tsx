
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

interface ESICWelcomeCardProps {}

const ESICWelcomeCard: React.FC<ESICWelcomeCardProps> = () => {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold mb-2 md:mb-3 flex items-center text-gray-950">
              <FileQuestion className="h-6 w-6 mr-2 text-blue-700" />
              Sistema de Informação ao Cidadão (e-SIC)
            </h2>
            <p className="text-gray-600">
              Gerencie solicitações de acesso à informação de forma simples e eficiente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESICWelcomeCard;
