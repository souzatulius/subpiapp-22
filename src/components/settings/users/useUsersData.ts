
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, Area, Cargo } from './types';

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    setLoading(true);
    
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select(`
          id, 
          nome_completo, 
          email, 
          aniversario, 
          whatsapp, 
          foto_perfil_url,
          cargo_id,
          area_coordenacao_id,
          cargos:cargo_id(id, descricao),
          areas_coordenacao:area_coordenacao_id(id, descricao)
        `);
        
      if (usersError) throw usersError;
      
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao');
        
      if (areasError) throw areasError;
      
      const { data: cargosData, error: cargosError } = await supabase
        .from('cargos')
        .select('id, descricao');
        
      if (cargosError) throw cargosError;
      
      setUsers(usersData || []);
      setAreas(areasData || []);
      setCargos(cargosData || []);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return {
    users,
    areas,
    cargos,
    loading,
    fetchData,
  };
};
