
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CardConfig {
  cards_config: string;
  user_id: string;
}

/**
 * Utility function to migrate user dashboard configurations to the new tables
 */
export const migrateUserDashboards = async (): Promise<void> => {
  try {
    // Fetch all existing user dashboards
    const { data: userDashboards, error: fetchError } = await supabase
      .from('user_dashboard')
      .select('cards_config, user_id');

    if (fetchError) throw fetchError;

    if (!userDashboards || userDashboards.length === 0) {
      console.log('No user dashboards to migrate');
      return;
    }

    // Prepare communication dashboards - initially copy all user dashboards
    const communicationDashboards = userDashboards.map(dashboard => ({
      user_id: dashboard.user_id,
      cards_config: dashboard.cards_config,
    }));

    // Insert data into the new user_dashboard_comunicacao table
    const { error: insertError } = await supabase
      .from('user_dashboard_comunicacao')
      .upsert(communicationDashboards, { onConflict: 'user_id' });

    if (insertError) throw insertError;

    console.log('Dashboard migration completed successfully');
  } catch (error) {
    console.error('Error migrating user dashboards:', error);
    toast({
      title: 'Erro na migração',
      description: 'Não foi possível migrar as configurações dos dashboards.',
      variant: 'destructive',
    });
  }
};

/**
 * Utility function to migrate department dashboard configurations to the new tables
 */
export const migrateDepartmentDashboards = async (): Promise<void> => {
  try {
    // Fetch all existing department dashboards
    const { data: departmentDashboards, error: fetchError } = await supabase
      .from('department_dashboard')
      .select('cards_config, department');

    if (fetchError) throw fetchError;

    if (!departmentDashboards || departmentDashboards.length === 0) {
      console.log('No department dashboards to migrate');
      return;
    }

    // Prepare communication dashboards - initially copy all department dashboards
    const communicationDashboards = departmentDashboards.map(dashboard => ({
      department: dashboard.department,
      cards_config: dashboard.cards_config,
      view_type: 'dashboard'
    }));

    // Insert data into the new department_dashboard_comunicacao table
    const { error: insertError } = await supabase
      .from('department_dashboard_comunicacao')
      .upsert(communicationDashboards, { onConflict: 'department' });

    if (insertError) throw insertError;

    console.log('Department dashboard migration completed successfully');
  } catch (error) {
    console.error('Error migrating department dashboards:', error);
    toast({
      title: 'Erro na migração',
      description: 'Não foi possível migrar as configurações dos dashboards departamentais.',
      variant: 'destructive',
    });
  }
};
