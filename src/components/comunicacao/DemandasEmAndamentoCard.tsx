
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Demanda {
  id: string;
  titulo: string;
  status: string;
  coordenacao_id: string;
}

interface DemandasEmAndamentoCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
}

const DemandasEmAndamentoCard: React.FC<DemandasEmAndamentoCardProps> = ({ 
  coordenacaoId, 
  isComunicacao 
}) => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDemandas() {
      try {
        setIsLoading(true);
        let query = supabase
          .from('demandas')
          .select('id, titulo, status, coordenacao_id')
          .not('status', 'eq', 'finalizada');
        
        if (!isComunicacao) {
          query = query.eq('coordenacao_id', coordenacaoId);
        }
        
        const { data, error } = await query
          .order('horario_publicacao', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching demandas:', error);
          return;
        }

        setDemandas(data || []);
      } catch (err) {
        console.error('Failed to fetch demandas:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDemandas();
  }, [coordenacaoId, isComunicacao]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/dashboard/comunicacao/consultar-demandas?search=${encodeURIComponent(searchTerm)}`);
  };

  // Updated to navigate directly to the specific demand with correct path
  const handleDemandaClick = (id: string) => {
    navigate(`/dashboard/comunicacao/responder?id=${id}`);
  };

  const handleViewAllClick = () => {
    navigate(`/dashboard/comunicacao/consultar-demandas`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-[10px]">Pendente</Badge>;
      case 'respondida':
        return <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800">Respondida</Badge>;
      case 'em_analise':
        return <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-800">Em análise</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-green-600 text-white pb-3">
        <CardTitle className="text-lg">Demandas em Andamento</CardTitle>
        <CardDescription className="text-green-100">
          {isComunicacao ? "Todas as demandas ativas" : "Suas demandas ativas"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <form onSubmit={handleSearch} className="mb-3 flex">
          <Input
            placeholder="Buscar demandas..."
            className="text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="ghost" size="icon" type="submit" className="ml-1">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="overflow-y-auto max-h-[220px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          ) : demandas.length > 0 ? (
            <div className="space-y-2">
              {demandas.map((demanda) => (
                <div 
                  key={demanda.id} 
                  className="p-2 border rounded-md cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => handleDemandaClick(demanda.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-sm line-clamp-1">{demanda.titulo}</div>
                    {getStatusBadge(demanda.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-center">
              <p className="text-gray-600">Nenhuma demanda em andamento.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between hover:bg-green-100"
          onClick={handleViewAllClick}
        >
          <span>Ver todas as demandas</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemandasEmAndamentoCard;
