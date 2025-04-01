
import { supabase } from './client';

export async function ensureStorageBuckets() {
  try {
    // Check if 'demandas' bucket exists, if not create it
    const { data: demandasBucket, error: demandasError } = await supabase
      .storage
      .getBucket('demandas');
      
    if (demandasError && demandasError.message.includes('does not exist')) {
      const { error: createError } = await supabase
        .storage
        .createBucket('demandas', {
          public: true, // Make files publicly accessible
          fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
        });
        
      if (createError) {
        console.error('Error creating demandas bucket:', createError);
      } else {
        console.log('Created demandas bucket successfully');
      }
    }
    
    // Check if 'demand_attachments' bucket exists, if not create it
    const { data: attachmentsBucket, error: attachmentsError } = await supabase
      .storage
      .getBucket('demand_attachments');
      
    if (attachmentsError && attachmentsError.message.includes('does not exist')) {
      const { error: createError } = await supabase
        .storage
        .createBucket('demand_attachments', {
          public: true, // Make files publicly accessible
          fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
        });
        
      if (createError) {
        console.error('Error creating demand_attachments bucket:', createError);
      } else {
        console.log('Created demand_attachments bucket successfully');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets exist:', error);
    return false;
  }
}
