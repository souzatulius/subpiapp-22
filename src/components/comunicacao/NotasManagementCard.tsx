
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotasManagementCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

interface Nota {
  id: string;
  titulo: string;
  status: string;
  criado_em: string;
  autor: {
    nome_completo: string;
  };
}

const NotasManagementCard: React.FC<NotasManagementCardProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = ''
}) => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [totalNotas, setTotalNotas] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('notas_oficiais')
          .select(`
            id, 
            titulo, 
            status, 
            criado_em,
            autor_id,
            usuarios!autor_id (nome_completo)
          `);
        
        // Apply filters based on role
        if (isComunicacao) {
          // For communication team, show all notes
          query = query
            .order('criado_em', { ascending: false });
        } else {
          // For other areas, show only notes for their coordination
          query = query
            .eq('coordenacao_id', coordenacaoId)
            .order('criado_em', { ascending: false });
        }
        
        // Get count
        const { data: countData, error: countError } = await query;
        if (countError) {
          console.error('Error fetching notas count:', countError);
          return;
        }
        
        setTotalNotas(countData?.length || 0);
        
        // Then get limited data 
        const { data, error } = await query.limit(5);
        
        if (error) {
          console.error('Error fetching notas:', error);
          return;
        }
        
        // Transform the data to match the Nota interface
        const formattedNotas: Nota[] = data.map((nota: any) => ({
          id: nota.id,
          titulo: nota.titulo,
          status: nota.status,
          criado_em: nota.criado_em,
          autor: {
            nome_completo: nota.usuarios?.nome_completo || 'Desconhecido'
          }
        }));
        
        setNotas(formattedNotas);
      } catch (err) {
        console.error('Failed to fetch notas:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (coordenacaoId || isComunicacao) {
      fetchNotas();
    }
  }, [coordenacaoId, isComunicacao]);

  const handleCardClick = () => {
    navigate(`${baseUrl ? `/${baseUrl}` : ''}`);
  };
  
  const handleNotaClick = (id: string) => {
    navigate(`${baseUrl ? `/${baseUrl}` : ''}/${id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5 text-orange-500" />
          Notas Oficiais
        </CardTitle>
        <Badge className="bg-orange-500 hover:bg-orange-600">{totalNotas}</Badge>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : notas.length > 0 ? (
          <>
            <ul className="space-y-2">
              {notas.map((nota) => (
                <li 
                  key={nota.id}
                  className="p-2 hover:bg-orange-50 rounded-md cursor-pointer"
                  onClick={() => handleNotaClick(nota.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {nota.titulo}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 ${getStatusColor(nota.status)}`}>
                      {nota.status}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {nota.autor?.nome_completo}
                    </span>
                    <span className="text-xs text-orange-600">
                      {formatDate(nota.criado_em)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleCardClick}
              className="w-full mt-3 flex items-center justify-center p-2 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm"
            >
              Ver todas <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Não há notas oficiais disponíveis.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotasManagementCard;
