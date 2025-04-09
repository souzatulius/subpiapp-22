
import { useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const useCardStorage = (user: User | null, coordenacaoId: string | null) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveCardConfig = async (cards: ActionCardItem[]): Promise<boolean> => {
    if (!user) {
      console.error('No user provided to saveCardConfig');
      return false;
    }

    setIsSaving(true);
    
    try {
      // Check if record exists
      const { data: existingData } = await supabase
        .from('user_dashboard')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_dashboard')
          .update({
            cards_config: cards,
            coordenacao_id: coordenacaoId || null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error updating dashboard config:', error);
          toast({
            title: 'Erro ao salvar configuração',
            description: 'Não foi possível salvar suas alterações',
            variant: 'destructive'
          });
          return false;
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_dashboard')
          .insert({
            user_id: user.id,
            cards_config: cards,
            coordenacao_id: coordenacaoId || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error creating dashboard config:', error);
          toast({
            title: 'Erro ao criar configuração',
            description: 'Não foi possível salvar suas alterações',
            variant: 'destructive'
          });
          return false;
        }
      }
      
      // toast({
      //   title: 'Dashboard atualizado',
      //   description: 'Suas configurações foram salvas com sucesso'
      // });
      
      return true;
    } catch (err) {
      console.error('Error saving card config:', err);
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar suas alterações',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    saveCardConfig,
    isSaving
  };
};

export default useCardStorage;
