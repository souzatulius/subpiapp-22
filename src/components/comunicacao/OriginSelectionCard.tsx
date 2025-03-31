
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrigens } from '@/hooks/comunicacao/useOrigens';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOriginIcon } from '@/hooks/useOriginIcon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const OriginSelectionCard = () => {
  const { origens, isLoading } = useOrigens();
  const navigate = useNavigate();

  const handleOriginSelect = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
  };

  if (isLoading) {
    return (
      <Card className="w-full h-full shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-600">Nova Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500 mt-2">Carregando opções...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-600">Nova Solicitação</CardTitle>
        <p className="text-sm text-gray-500">De onde vem a demanda?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {origens.map((origem) => (
            <Button
              key={origem.id}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 transition-all hover:border-blue-500 hover:bg-blue-50"
              onClick={() => handleOriginSelect(origem.id)}
            >
              <div className="mb-2">
                {useOriginIcon(origem, "h-8 w-8")}
              </div>
              <span className="text-xs font-medium text-center">{origem.descricao}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
