
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useBadgeValues = () => {
  const [badgeValues, setBadgeValues] = useState<Record<string, number | string>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchBadgeValues = async () => {
      try {
        // Fetch user's department/coordination
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('department_id')
          .eq('id', user.id)
          .single();

        if (userError || !userData?.department_id) {
          console.error('Error fetching user department:', userError);
          return;
        }

        const departmentId = userData.department_id;

        // Sample badge value counts - in a real app, these would be fetched from your backend
        const pendingDemands = Math.floor(Math.random() * 10) + 1; // Random number between 1-10
        const pendingNotes = Math.floor(Math.random() * 5) + 1;
        const notesToApprove = Math.floor(Math.random() * 8) + 1;

        // Set badge values
        const badges: Record<string, number> = {
          'responder-demandas': pendingDemands,
          'criar-nota': pendingNotes,
          'aprovar-notas': notesToApprove
        };

        setBadgeValues(badges);
      } catch (error) {
        console.error('Error fetching badge values:', error);
      }
    };

    fetchBadgeValues();
  }, [user]);

  const getBadgeValue = (cardId: string): string | undefined => {
    const value = badgeValues[cardId];
    return value !== undefined ? String(value) : undefined;
  };

  return { getBadgeValue };
};

export default useBadgeValues;
