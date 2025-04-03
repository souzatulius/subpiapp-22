
import { supabase } from '@/integrations/supabase/client';

export const setupProfilePhotosStorage = async () => {
  try {
    // Check if 'usuarios' bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'usuarios');
    
    if (!bucketExists) {
      console.log('Creating usuarios bucket...');
      const { error: createError } = await supabase.storage.createBucket('usuarios', {
        public: true
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      console.log('Bucket created successfully');

      // Update bucket policies to make it public
      const { error: updateError } = await supabase.storage.updateBucket('usuarios', {
        public: true
      });
      
      if (updateError) {
        console.error('Error updating bucket policies:', updateError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up profile photos storage:', error);
    return false;
  }
};
