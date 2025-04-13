
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOriginIcon } from '@/hooks/useOriginIcon';

interface OrigemDemanda {
  id: string;
  descricao: string;
  icone?: string | null;
}

const PressRequestCard: React.FC = () => {
  const [origens, setOrigens] = useState<OrigemDemanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrigens = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('origens_demandas')
          .select('id, descricao, icone')
          .order('descricao');
        
        if (error) {
          console.error('Error fetching origens:', error);
          return;
        }
        
        setOrigens(data || []);
      } catch (err) {
        console.error('Failed to fetch origens:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrigens();
  }, []);

  const handleOriginClick = (originId: string) => {
    setSelectedId(originId);
    
    // Clear any existing form data in local storage
    localStorage.removeItem('comunicacao_form_data');
    
    // Short delay for visual feedback before navigating
    setTimeout(() => {
      navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
    }, 300);
  };

  const originsList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      );
    }
    
    if (origens.length === 0) {
      return (
        <div className="flex justify-center items-center p-6">
          <p className="text-gray-500">Nenhuma origem encontrada</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {origens.map((origem) => {
          const Icon = useOriginIcon(origem);
          
          return (
            <motion.button
              key={origem.id}
              onClick={() => handleOriginClick(origem.id)}
              className={`flex items-center p-3 rounded-2xl transition-colors ${
                selectedId === origem.id 
                  ? "bg-orange-200 border-2 border-orange-400" 
                  : "bg-white hover:bg-orange-50 border-2 border-orange-100"
              } w-full`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex justify-center items-center w-14 h-14 rounded-full bg-orange-50 text-orange-600 mr-3">
                {React.cloneElement(Icon as React.ReactElement, { className: "h-7 w-7" })}
              </span>
              <span className="text-sm font-medium text-orange-700 truncate">
                {origem.descricao}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  }, [origens, isLoading, selectedId]);

  return (
    <Card className="h-full w-full bg-orange-100 border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Newspaper className="mr-2 h-5 w-5 text-orange-500" />
          Nova Solicitação da Imprensa
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {originsList}
      </CardContent>
    </Card>
  );
};

export default PressRequestCard;
