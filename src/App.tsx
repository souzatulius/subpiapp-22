
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { ensureStorageBuckets } from '@/integrations/supabase/createBuckets';

import '@/App.css';

function App() {
  useEffect(() => {
    // Ensure Supabase storage buckets exist when the app loads
    ensureStorageBuckets().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
