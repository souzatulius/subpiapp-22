
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useDemandFormData = () => {
  const [areasCoord, setAreasCoord] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [origens, setOrigens] = useState<any[]>([]);
  const [tiposMidia, setTiposMidia] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [bairros, setBairros] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('*');
        if (areasError) throw areasError;
        setAreasCoord(areasData || []);

        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('*');
        if (servicosError) throw servicosError;
        setServicos(servicosData || []);

        const { data: origensData, error: origensError } = await supabase
          .from('origens_demandas')
          .select('*');
        if (origensError) throw origensError;
        setOrigens(origensData || []);

        const { data: tiposMidiaData, error: tiposMidiaError } = await supabase
          .from('tipos_midia')
          .select('*');
        if (tiposMidiaError) throw tiposMidiaError;
        setTiposMidia(tiposMidiaData || []);

        const { data: distritosData, error: distritosError } = await supabase
          .from('distritos')
          .select('*');
        if (distritosError) throw distritosError;
        setDistritos(distritosData || []);

        const { data: bairrosData, error: bairrosError } = await supabase
          .from('bairros')
          .select('*');
        if (bairrosError) throw bairrosError;
        setBairros(bairrosData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações necessárias.",
          variant: "destructive"
        });
      }
    };
    fetchData();
  }, []);

  return {
    areasCoord,
    servicos,
    origens,
    tiposMidia,
    distritos,
    bairros,
    isLoading,
    setIsLoading
  };
};
