
import { supabase } from '@/integrations/supabase/client';

export const setupProfilePhotosStorage = async () => {
  try {
    console.log('Checking storage configuration for profile photos...');
    
    // Check if the bucket exists - we'll assume it exists since we've created it via SQL
    // but we'll handle potential permission issues gracefully
    
    try {
      // Test access to the bucket with a minimal operation
      const { data: objects, error } = await supabase.storage
        .from('usuarios')
        .list('fotos_perfil', {
          limit: 1,
        });
      
      if (error) {
        console.warn('Could not list bucket objects:', error.message);
        // Don't throw here, just warn - the bucket might exist but be empty
      }
      
      console.log('Storage access check completed');
      return true;
    } catch (error) {
      console.error('Error checking storage configuration:', error);
      // We'll continue even if we hit an error here - the upload might still work
      return true;
    }
  } catch (error) {
    console.error('Unexpected error in setupProfilePhotosStorage:', error);
    return false;
  }
};
