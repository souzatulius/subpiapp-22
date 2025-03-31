
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Check } from 'lucide-react';

interface Nota {
  id: string;
  titulo: string;
  status: string;
  tipo: 'pending_creation' | 'pending_approval';
  demanda_id?: string;
}

interface NotasManagementCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
}

const NotasManagementCard: React.FC<NotasManagementCardProps> = ({ coordenacaoId, isComunicacao }) => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotas() {
      try {
        setIsLoading(true);
        const notasData: Nota[] = [];
        
        // For Comunicação users, show demandas that need nota
        if (isComunicacao) {
          const { data: demandsNeedingNotas, error: demandsError } = await supabase
            .from('demandas')
            .select('id, titulo')
            .eq('status', 'respondida')
            .not('respostas_demandas', 'is', null)
            .limit(3);

          if (demandsError) {
            console.error('Error fetching demands for notas:', demandsError);
          } else if (demandsNeedingNotas) {
            demandsNeedingNotas.forEach(demand => {
              notasData.push({
                id: demand.id,
                titulo: demand.titulo,
                status: 'pendente_criacao',
                tipo: 'pending_creation',
                demanda_id: demand.id
              });
            });
          }
        }
        
        // For all users (including Comunicação), show notas waiting for approval
        let query = supabase
          .from('notas_oficiais')
          .select('id, titulo, status');
        
        // If not comunicacao, only show notas for their coordenacao
        if (!isComunicacao) {
          query = query.eq('coordenacao_id', coordenacaoId);
        }
        
        const { data: pendingNotas, error: notasError } = await query
          .eq('status', 'pendente')
          .limit(3);

        if (notasError) {
          console.error('Error fetching pending notas:', notasError);
        } else if (pendingNotas) {
          pendingNotas.forEach(nota => {
            notasData.push({
              id: nota.id,
              titulo: nota.titulo,
              status: nota.status,
              tipo: 'pending_approval'
            });
          });
        }

        setNotas(notasData);
      } catch (err) {
        console.error('Failed to fetch notas data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotas();
  }, [coordenacaoId, isComunicacao]);

  const handleNotaClick = (nota: Nota) => {
    if (nota.tipo === 'pending_creation') {
      navigate(`/dashboard/comunicacao/criar-nota?demanda=${nota.demanda_id}`);
    } else {
      navigate(`/dashboard/comunicacao/aprovar-nota/${nota.id}`);
    }
  };

  const handleViewAllClick = () => {
    navigate(`/dashboard/comunicacao/consultar-notas`);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-blue-700 text-white pb-3">
        <CardTitle className="text-lg">Gerenciamento de Notas</CardTitle>
        <CardDescription className="text-blue-100">
          {isComunicacao 
            ? "Criação e aprovação de notas oficiais" 
            : "Notas aguardando sua aprovação"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 overflow-y-auto flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
          </div>
        ) : notas.length > 0 ? (
          <div className="space-y-2">
            {notas.map((nota) => (
              <div 
                key={nota.id} 
                className="p-2 border rounded-md cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => handleNotaClick(nota)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-sm line-clamp-1">{nota.titulo}</div>
                  <Badge 
                    variant={nota.tipo === 'pending_creation' ? "outline" : "secondary"} 
                    className="text-[10px]"
                  >
                    {nota.tipo === 'pending_creation' ? 'Criar Nota' : 'Aprovar'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Check className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-gray-600">
              {isComunicacao 
                ? "Não há notas pendentes de criação ou aprovação."
                : "Não há notas aguardando sua aprovação."}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between hover:bg-blue-100"
          onClick={handleViewAllClick}
        >
          <span>Ver todas as notas</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotasManagementCard;
