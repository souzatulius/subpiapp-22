
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserDataResult {
  firstName: string;
  userCoordenaticaoId: string | null;
  isLoadingUser: boolean;
}

export const useUserData = (userId?: string): UserDataResult => {
  const [firstName, setFirstName] = useState('');
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setIsLoadingUser(false);
        return;
      }
      
      setIsLoadingUser(true);
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_completo, coordenacao_id')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching user info:', error);
          toast({
            title: "Erro ao carregar informações do usuário",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          // Extract first name
          const firstName = data.nome_completo.split(' ')[0];
          setFirstName(firstName);
          setUserCoordenaticaoId(data.coordenacao_id);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        toast({
          title: "Erro inesperado",
          description: "Não foi possível carregar suas informações",
          variant: "destructive"
        });
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserInfo();
  }, [userId]);

  return {
    firstName,
    userCoordenaticaoId,
    isLoadingUser
  };
};
