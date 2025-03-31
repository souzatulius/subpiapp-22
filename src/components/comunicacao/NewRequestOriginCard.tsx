
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, MessageSquare, FileText, BadgePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

interface OrigemDemanda {
  id: string;
  descricao: string;
  icone?: string | null;
}

interface NewRequestOriginCardProps {
  baseUrl?: string;
}

const NewRequestOriginCard: React.FC<NewRequestOriginCardProps> = ({ baseUrl = '' }) => {
  const [origens, setOrigens] = useState<OrigemDemanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    navigate(`${baseUrl ? `/${baseUrl}` : ''}/cadastrar?origem_id=${originId}`);
  };
  
  // Function to get the correct icon component
  const getIconComponent = (iconName: string | null | undefined): React.ReactNode => {
    if (!iconName) return <BadgePlus className="h-5 w-5" />;
    
    // Convert string to Lucide icon format (first letter uppercase, rest lowercase)
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
    
    // Check if icon exists in Lucide library
    const LucideIcon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[formattedIconName];
    
    if (LucideIcon) {
      return <LucideIcon className="h-5 w-5" />;
    }
    
    // Default icon if not found
    return <BadgePlus className="h-5 w-5" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Plus className="mr-2 h-5 w-5 text-blue-500" />
          Nova Solicitação
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
              <button
                key={origem.id}
                onClick={() => handleOriginClick(origem.id)}
                className="flex items-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <span className="flex justify-center items-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">
                  {getIconComponent(origem.icone)}
                </span>
                <span className="text-sm font-medium text-blue-700 truncate flex-1 text-left">
                  {origem.descricao}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewRequestOriginCard;
