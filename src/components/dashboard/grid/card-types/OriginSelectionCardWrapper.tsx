
import React, { useEffect, useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import OriginSelectionCard from '@/components/dashboard/cards/OriginSelectionCard';
import { supabase } from '@/integrations/supabase/client';

interface OriginSelectionCardWrapperProps {
  card: ActionCardItem;
}

interface Origin {
  id: string;
  descricao: string;
  icone?: string | null;
}

const OriginSelectionCardWrapper: React.FC<OriginSelectionCardWrapperProps> = ({
  card
}) => {
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrigins = async () => {
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
    };
    
    fetchOrigins();
  }, []);

  return (
    <OriginSelectionCard 
      title={card.title || "De onde vem a solicitação?"}
      options={origins}
    />
  );
};

export default OriginSelectionCardWrapper;
