
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { getInitialDashboardCards } from '@/hooks/dashboard/defaultCards';

// Function to get cards from the database
export const getDashboardCards = async (
  userId: string, 
  departmentId?: string
): Promise<ActionCardItem[]> => {
  try {
    // If using Supabase, fetch user's dashboard configuration
    const { data, error } = await supabase
      .from('user_dashboard')
      .select('cards_config')
      .eq('user_id', userId)
      .eq('department_id', departmentId || 'comunicacao')
      .single();

    if (error) {
      console.error('Error fetching dashboard cards:', error);
      return getInitialDashboardCards(departmentId);
    }

    if (data && data.cards_config) {
      return JSON.parse(data.cards_config);
    } else {
      return getInitialDashboardCards(departmentId);
    }
  } catch (err) {
    console.error('Error processing dashboard cards:', err);
    return getInitialDashboardCards(departmentId);
  }
};
