
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Newspaper, Phone, Mail, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrigens } from '@/hooks/comunicacao/useOrigens';
import { useOriginIcon } from '@/hooks/useOriginIcon';

const OriginSelectionCard: React.FC = () => {
  const navigate = useNavigate();
  const { origens, isLoading } = useOrigens();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleOriginSelect = (originId: string) => {
    setSelectedId(originId);
    setLoading(true);
    
    // Simulate a brief loading state before redirecting
    setTimeout(() => {
      navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
    }, 600);
  };
  
  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Cadastrar Demanda</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">De onde vem a solicitação?</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {origens.map((origem) => (
            <div
              key={origem.id}
              onClick={() => !loading && handleOriginSelect(origem.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer border-2 transition-all",
                selectedId === origem.id 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              <div className="text-gray-600 mb-2">
                {selectedId === origem.id && loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                ) : (
                  <div className="h-6 w-6 flex items-center justify-center">
                    {useOriginIcon(origem)}
                  </div>
                )}
              </div>
              <div className="text-center text-sm font-medium">
                {origem.descricao}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
