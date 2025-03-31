
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ComunicacaoCard from './ComunicacaoCard';
import { PlusCircle } from 'lucide-react';
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

  return (
    <ComunicacaoCard
      title="Nova Demanda"
      icon={<PlusCircle size={18} />}
      loading={isLoading}
    >
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-2 text-gray-500">Selecione a origem da demanda:</h4>
        
        <div className="space-y-2">
          {origens?.map((origem) => (
            <Button
              key={origem.id}
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to={`/${baseUrl}/cadastrar?origem_id=${origem.id}`}>
                {origem.descricao}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </ComunicacaoCard>
  );
};

export default NewRequestOriginCard;
