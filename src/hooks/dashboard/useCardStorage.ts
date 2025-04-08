
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';

export const useCardStorage = (user: any | null, userDepartment: string | null) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveCardConfig = async (updatedCards: ActionCardItem[]) => {
    if (!user) return false;
    
    try {
      setIsSaving(true);
      console.log('Saving card configuration for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('cards_config')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        console.log('Updating existing card configuration');
        const { error: updateError } = await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (updateError) throw updateError;
      } else {
        console.log('Creating new card configuration');
        const { error: insertError } = await supabase
          .from('user_dashboard')
          .insert({ 
            user_id: user.id,
            cards_config: JSON.stringify(updatedCards),
            department_id: userDepartment || null
          });
          
        if (insertError) throw insertError;
      }
      
      console.log('Card configuration saved successfully');
      return true;
    } catch (error) {
      console.error('Error in saveCardConfig:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar suas personalizações do dashboard.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveCardConfig, isSaving };
};
