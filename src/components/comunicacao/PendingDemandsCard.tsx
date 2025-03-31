
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface Demand {
  id: string;
  titulo: string;
  coordenacao_id: string;
  status: string;
  prazo_resposta: string;
}

interface PendingDemandsCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
}

const PendingDemandsCard: React.FC<PendingDemandsCardProps> = ({ coordenacaoId, isComunicacao }) => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDemands() {
      try {
        setIsLoading(true);
        let query = supabase
          .from('demandas')
          .select('id, titulo, coordenacao_id, status, prazo_resposta')
          .eq('status', 'pendente');

        // If user is not from Comunicacao, only show demands for their coordenacao
        if (!isComunicacao) {
          query = query.eq('coordenacao_id', coordenacaoId);
        }

        const { data, error } = await query
          .order('prazo_resposta')
          .limit(5);

        if (error) {
          console.error('Error fetching demands:', error);
          return;
        }

        setDemands(data || []);
      } catch (err) {
        console.error('Failed to fetch demands:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDemands();
  }, [coordenacaoId, isComunicacao]);

  // Updated to navigate directly to the specific demand with correct path
  const handleDemandClick = (id: string) => {
    navigate(`/dashboard/comunicacao/responder?id=${id}`);
  };

  const handleViewAllClick = () => {
    navigate(`/dashboard/comunicacao/responder`);
  };

  // Check if prazo is expired
  const isPrazoExpired = (prazo: string): boolean => {
    return new Date(prazo) < new Date();
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-orange-500 text-white pb-3">
        <CardTitle className="text-lg">Responder Demandas</CardTitle>
        <CardDescription className="text-orange-100">
          {isComunicacao 
            ? "Aguardando respostas das áreas técnicas" 
            : "Aguardando sua resposta"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 overflow-y-auto flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        ) : demands.length > 0 ? (
          <div className="space-y-2">
            {demands.map((demand) => (
              <div 
                key={demand.id} 
                className="p-2 border rounded-md cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={() => handleDemandClick(demand.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-sm line-clamp-1">{demand.titulo}</div>
                  {isPrazoExpired(demand.prazo_resposta) && (
                    <Badge variant="destructive" className="text-[10px]">Atrasada</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Prazo: {new Date(demand.prazo_resposta).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Check className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-gray-600">Oba! Você não possui demandas abertas.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between hover:bg-orange-100"
          onClick={handleViewAllClick}
        >
          <span>Ver todas</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingDemandsCard;
