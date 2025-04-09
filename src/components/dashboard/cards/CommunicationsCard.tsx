
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Communication {
  id: string;
  titulo: string;
  mensagem: string;
  data_envio: string;
}

interface CommunicationsCardProps {
  className?: string;
}

const CommunicationsCard: React.FC<CommunicationsCardProps> = ({ 
  className = '' 
}) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommunications = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comunicados')
          .select('id, titulo, mensagem, data_envio')
          .order('data_envio', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching communications:', error);
          return;
        }

        setCommunications(data || []);
      } catch (error) {
        console.error('Failed to fetch communications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunications();
    // Refresh every 10 minutes
    const interval = setInterval(fetchCommunications, 10 * 60 * 1000);
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

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 p-3 h-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex flex-col space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (communications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Megaphone className="h-8 w-8 text-gray-300 mb-2" />
        <p className="text-gray-500 text-sm text-center">Não há comunicados recentes</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-3 p-3 h-full ${className}`}>
      {communications.map(comm => (
        <div key={comm.id} className="border-b pb-2 last:border-b-0">
          <h4 className="font-medium text-sm">{comm.titulo}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{comm.mensagem}</p>
          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(comm.data_envio)}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunicationsCard;
