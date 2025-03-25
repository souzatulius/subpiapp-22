
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coordination } from '@/hooks/settings/useCoordination';
import { Area } from '@/hooks/coordination-areas/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CoordinationsList = () => {
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);
  const [supervisions, setSupervisions] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch coordinations (is_supervision = false)
        const { data: coordData, error: coordError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao, sigla')
          .is('coordenacao_id', null)
          .eq('is_supervision', false)
          .order('descricao');
        
        if (coordError) throw coordError;
        
        // Fetch technical supervisions (is_supervision = true)
        const { data: supervData, error: supervError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao, sigla, coordenacao, coordenacao_id')
          .eq('is_supervision', true)
          .order('descricao');
        
        if (supervError) throw supervError;
        
        setCoordinations(coordData || []);
        setSupervisions(supervData || []);
      } catch (error) {
        console.error('Error fetching coordinations and supervisions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coordenações</CardTitle>
        </CardHeader>
        <CardContent>
          {coordinations.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma coordenação cadastrada.</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2">
              {coordinations.map(coord => (
                <li key={coord.id}>
                  <span className="font-medium">{coord.descricao}</span>
                  {coord.sigla && <span className="ml-2 text-sm text-muted-foreground">({coord.sigla})</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Supervisões Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          {supervisions.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma supervisão técnica cadastrada.</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2">
              {supervisions.map(superv => (
                <li key={superv.id}>
                  <span className="font-medium">{superv.descricao}</span>
                  {superv.sigla && <span className="ml-2 text-sm text-muted-foreground">({superv.sigla})</span>}
                  {superv.coordenacao && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      - Coordenação: {superv.coordenacao}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinationsList;
