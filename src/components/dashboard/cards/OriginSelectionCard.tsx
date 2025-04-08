
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface OriginOption {
  id: string;
  descricao: string;
  icone?: string | null;
}

interface OriginSelectionCardProps {
  title: string;
}

const OriginSelectionCard: React.FC<OriginSelectionCardProps> = ({ title }) => {
  const [origins, setOrigins] = useState<OriginOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
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

  const handleOriginSelect = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
  };
  
  // Function to get the correct icon component
  const getIconComponent = (iconName: string | null | undefined): React.ReactNode => {
    if (!iconName) return <LucideIcons.FileText className="h-5 w-5" />;
    
    // Convert string to Lucide icon format (first letter uppercase, rest lowercase)
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
    
    // Check if icon exists in Lucide library
    const LucideIcon = (LucideIcons as any)[formattedIconName];
    
    if (LucideIcon && typeof LucideIcon === 'function') {
      return <LucideIcon className="h-5 w-5" />;
    }
    
    // Default icon if not found
    return <LucideIcons.FileText className="h-5 w-5" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-700">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {origins.map((origin) => (
              <button
                key={origin.id}
                onClick={() => handleOriginSelect(origin.id)}
                className="p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-md text-center transition-colors flex flex-col items-center justify-center h-24"
              >
                <div className="text-2xl mb-2 text-blue-600">
                  {getIconComponent(origin.icone)}
                </div>
                <span className="text-sm font-medium text-gray-800">{origin.descricao}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
