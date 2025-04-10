
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Comunicado {
  id: string;
  titulo: string;
  mensagem: string;
  data_envio: string;
  destinatarios?: string;
  autor?: {
    nome_completo?: string;
  };
}

interface ComunicadosCardProps {
  id: string;
  title: string;
  className?: string;
}

const ComunicadosCard: React.FC<ComunicadosCardProps> = ({ 
  id,
  title,
  className = '' 
}) => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComunicados = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comunicados')
          .select('id, titulo, mensagem, data_envio, destinatarios, autor:autor_id(nome_completo)')
          .order('data_envio', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching comunicados:', error);
          return;
        }

        setComunicados(data || []);
      } catch (error) {
        console.error('Failed to fetch comunicados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComunicados();
    // Refresh every 5 minutes
    const interval = setInterval(fetchComunicados, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'Data desconhecida';
    }
  };

  const handleViewAll = () => {
    navigate('/dashboard/settings/comunicados');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 p-4 h-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex flex-col space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (comunicados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Megaphone className="h-8 w-8 text-gray-300 mb-2" />
        <p className="text-gray-500 text-sm text-center">Não há comunicados recentes</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full flex items-center justify-center gap-1"
          onClick={handleViewAll}
        >
          <span>Ver todos os comunicados</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-auto p-4">
        <h3 className="font-bold mb-4 text-lg">{title}</h3>
        <div className="space-y-3">
          {comunicados.map(comunicado => (
            <div key={comunicado.id} className="border-b pb-3 last:border-b-0">
              <h4 className="font-medium text-sm">{comunicado.titulo}</h4>
              <p className="text-xs text-gray-500 line-clamp-2">{comunicado.mensagem}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">{formatTimeAgo(comunicado.data_envio)}</p>
                {comunicado.autor?.nome_completo && (
                  <p className="text-xs text-blue-500">Por: {comunicado.autor.nome_completo}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1"
          onClick={handleViewAll}
        >
          <span>Ver todos os comunicados</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ComunicadosCard;
