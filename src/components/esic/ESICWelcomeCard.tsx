
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface ESICWelcomeCardProps {
  onNovoProcesso: () => void;
}

const ESICWelcomeCard: React.FC<ESICWelcomeCardProps> = ({ onNovoProcesso }) => {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Processos e-SIC</CardTitle>
        <CardDescription className="text-gray-500">
          Gerenciar processos e justificativas para as solicitações recebidas via e-SIC.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600">
          Cadastre processos e-SIC, adicione justificativas manualmente ou com auxílio de IA, 
          e gerencie os status de cada processo de maneira simplificada.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onNovoProcesso}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Processo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ESICWelcomeCard;
