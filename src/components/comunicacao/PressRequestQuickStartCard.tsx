
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, Newspaper, Mail, Phone, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface OrigemDemanda {
  id: string;
  descricao: string;
  icone?: string | null;
}

const PressRequestQuickStartCard: React.FC = () => {
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
  
  // Function to get the appropriate icon for each type of origin
  const getOriginIcon = (origem: OrigemDemanda) => {
    const iconMap: Record<string, React.ReactNode> = {
      'imprensa': <Newspaper className="h-5 w-5" />,
      'email': <Mail className="h-5 w-5" />,
      'telefone': <Phone className="h-5 w-5" />,
      'cidadao': <Users className="h-5 w-5" />,
      'gabinete': <Building2 className="h-5 w-5" />,
      // Default icon if nothing matches
      'default': <MessageSquare className="h-5 w-5" />
    };
    
    // Check if we have a matching icon based on the description or icon field
    const descLowercase = origem.descricao?.toLowerCase() || '';
    const iconeName = origem.icone?.toLowerCase() || '';
    
    // Try to match by icon field first, then by description
    for (const [key, value] of Object.entries(iconMap)) {
      if (iconeName.includes(key) || descLowercase.includes(key)) {
        return value;
      }
    }
    
    return iconMap.default;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Newspaper className="mr-2 h-5 w-5 text-blue-500" />
          Nova Solicitação da Imprensa
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {origens.map((origem) => (
              <motion.button
                key={origem.id}
                onClick={() => handleOriginClick(origem.id)}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  selectedId === origem.id 
                    ? "bg-blue-100 border-2 border-blue-500" 
                    : "bg-blue-50 hover:bg-blue-100 border-2 border-transparent"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex justify-center items-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">
                  {getOriginIcon(origem)}
                </span>
                <span className="text-sm font-medium text-blue-700 truncate flex-1 text-left">
                  {origem.descricao}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PressRequestQuickStartCard;
