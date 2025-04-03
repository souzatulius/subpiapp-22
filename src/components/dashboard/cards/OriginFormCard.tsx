
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useDynamicCardsData } from '@/hooks/dashboard/useDynamicCardsData';

const OriginFormCard: React.FC = () => {
  const { originOptions } = useDynamicCardsData();
  const navigate = useNavigate();
  
  const handleOriginSelect = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem=${originId}`);
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
          Nova Solicitação
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow py-2">
        <p className="text-sm text-gray-500 mb-3">De onde vem a demanda?</p>
        <div className="grid grid-cols-2 gap-2">
          {originOptions.map(option => (
            <Button 
              key={option.id}
              variant="outline"
              className="flex flex-col items-center justify-center h-16 py-2 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => handleOriginSelect(option.id)}
            >
              <span className="text-xs text-center">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="default" 
          size="sm"
          className="w-full"
          onClick={() => navigate('/dashboard/comunicacao/cadastrar')}
        >
          Cadastrar nova demanda
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OriginFormCard;
