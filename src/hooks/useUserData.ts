
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = (userId?: string) => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsLoadingUser(false);
        return;
      }

      try {
        console.log(`Fetching user data for ID: ${userId}`);
        
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            nome_completo,
            coordenacao_id (
              descricao
            )
          `)
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
          setIsLoadingUser(false);
          return;
        }

        if (data) {
          setUser(data);
          
          // Convert coordenacao_id.descricao to a normalized department ID
          const departmentDesc = data.coordenacao_id?.descricao || '';
          const normalizedDept = getDepartmentId(departmentDesc);
          setUserCoordenaticaoId(normalizedDept);
          
          console.log(`User department set to: ${normalizedDept} (from: ${departmentDesc})`);

          const fullName = data.nome_completo || '';
          const first = fullName.split(' ')[0] || 'Usuário';
          setFirstName(first);
        }
      } catch (error: any) {
        console.error('Unexpected error in useUserData:', error.message || error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [userId]);
  
  // Helper function to normalize department names
  const getDepartmentId = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('comunicação')) return 'comunicacao';
    if (desc.includes('gabinete')) return 'gabinete';
    
    // Return the original description as fallback
    return desc;
  };

  return {
    user,
    isLoadingUser,
    setUser,
    firstName,
    userCoordenaticaoId,
  };
};
