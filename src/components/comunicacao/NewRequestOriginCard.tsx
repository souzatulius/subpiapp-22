
import React from 'react';
import { CardContent } from '@/components/ui/card';
import ComunicacaoCard from './ComunicacaoCard';
import { PlusCircle, Newspaper, MessageSquare, Phone, Mail, Globe, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewRequestOriginCardProps {
  baseUrl?: string;
}

const NewRequestOriginCard: React.FC<NewRequestOriginCardProps> = ({ baseUrl = 'dashboard/comunicacao' }) => {
  const { data: origens, isLoading } = useQuery({
    queryKey: ['origens_demanda'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('origens_demandas')
        .select('*')
        .order('descricao');
        
      if (error) throw error;
      return data;
    }
  });

  // Map origin icons based on the origin data
  const getOriginIcon = (icone: string | null) => {
    switch (icone?.toLowerCase()) {
      case 'newspaper':
        return <Newspaper className="h-5 w-5 text-blue-500" />;
      case 'message':
      case 'messagesquare':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-orange-500" />;
      case 'mail':
        return <Mail className="h-5 w-5 text-purple-500" />;
      case 'globe':
        return <Globe className="h-5 w-5 text-cyan-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <ComunicacaoCard
      title="Nova Demanda"
      icon={<PlusCircle size={18} />}
      loading={isLoading}
    >
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-3 text-gray-500">Selecione a origem da demanda:</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {origens?.map((origem) => (
            <Link
              key={origem.id}
              to={`/${baseUrl}/cadastrar?origem_id=${origem.id}`}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <div className="mr-3 flex-shrink-0">
                {getOriginIcon(origem.icone)}
              </div>
              <span className="text-sm">{origem.descricao}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </ComunicacaoCard>
  );
};

export default NewRequestOriginCard;
