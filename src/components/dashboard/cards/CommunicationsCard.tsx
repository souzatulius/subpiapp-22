
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface CommunicationsCardProps {
  id: string;
  title?: string;
  limit?: number;
}

interface Communication {
  id: string;
  titulo: string;
  data_envio: string;
  mensagem: string;
}

const CommunicationsCard: React.FC<CommunicationsCardProps> = ({
  id,
  title = "Avisos",
  limit = 5
}) => {
  const navigate = useNavigate();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCommunications = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('comunicados')
          .select('id, titulo, mensagem, data_envio')
          .order('data_envio', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        
        const formattedCommunications = (data || []).map(item => ({
          id: item.id,
          titulo: item.titulo,
          mensagem: item.mensagem,
          data_envio: new Date(item.data_envio).toLocaleDateString('pt-BR')
        }));
        
        setCommunications(formattedCommunications);
      } catch (err) {
        console.error("Error fetching communications:", err);
        setCommunications([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunications();
  }, [limit]);

  const handleViewAllClick = () => {
    navigate('/dashboard/settings/comunicados');
  };
  
  const handleCommunicationClick = (id: string) => {
    navigate(`/dashboard/settings/comunicados/${id}`);
  };

  return (
    <Card className="h-full w-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Megaphone className="h-4 w-4 text-blue-500 mr-2" />
            {title}
          </h3>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Carregando avisos...</p>
            </div>
          ) : communications.length > 0 ? (
            <ul className="space-y-2">
              {communications.map(comm => (
                <li 
                  key={comm.id}
                  onClick={() => handleCommunicationClick(comm.id)}
                  className="p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
                >
                  <p className="text-sm font-medium">{comm.titulo}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{comm.mensagem}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {comm.data_envio}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Não há avisos disponíveis.</p>
            </div>
          )}
        </div>
        
        {communications.length > 0 && (
          <button 
            onClick={handleViewAllClick}
            className="mt-3 text-xs self-end px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded flex items-center"
          >
            Ver todos <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationsCard;
