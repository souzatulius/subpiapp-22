
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export const useCardStorage = (user: any | null, userDepartment: string | null, page: string = 'inicial') => {
  const saveCardConfig = async (updatedCards: ActionCardItem[]) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('cards_config')
        .eq('user_id', user.id)
        .eq('page', page)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('page', page);
      } else {
        await supabase
          .from('user_dashboard')
          .insert({ 
            user_id: user.id,
            cards_config: JSON.stringify(updatedCards),
            department_id: userDepartment || null,
            page: page
          });
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveCardConfig:', error);
      return false;
    }
  };

  return { saveCardConfig };
};
