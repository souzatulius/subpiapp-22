
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useOriginIcon } from '@/hooks/useOriginIcon';
import { Button } from '@/components/ui/button';

interface Origin {
  id: string;
  descricao: string;
  icone: string;
}

const OriginSelectionCard: React.FC = () => {
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrigins() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('origens_demandas')
          .select('id, descricao, icone')
          .order('descricao');

        if (error) {
          console.error('Error fetching origins:', error);
          return;
        }

        setOrigins(data || []);
      } catch (err) {
        console.error('Failed to fetch origins:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrigins();
  }, []);

  const handleOriginClick = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem=${originId}`);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-blue-600 text-white pb-3">
        <CardTitle className="text-lg">Cadastro de Demandas</CardTitle>
        <CardDescription className="text-blue-100">De onde vem a solicitação?</CardDescription>
      </CardHeader>
      <CardContent className="p-3 overflow-y-auto max-h-[320px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {origins.map((origin) => (
              <Button
                key={origin.id}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 transition-all hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleOriginClick(origin.id)}
              >
                <div className="text-blue-600 mb-2">
                  {useOriginIcon({ icone: origin.icone })}
                </div>
                <span className="text-xs text-center line-clamp-2">{origin.descricao}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
