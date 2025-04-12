
import { supabase } from '@/integrations/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const supabaseUrl = "https://mapjrbfzurpjmianfnev.supabase.co";
    
    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: 'Supabase URL not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get the request data
    const requestData = await request.json();
    
    // Call the Supabase Edge Function
    const functionUrl = `${supabaseUrl}/functions/v1/generate-ranking-insights`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcGpyYmZ6dXJwam1pYW5mbmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNDQ0NjAsImV4cCI6MjA1NzkyMDQ2MH0.BG4zRB-6i_cpXyT6w0Zb3EmFZ6d5ZB8YseqklLUPeXc`,
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: `Edge function error: ${errorData.error || response.statusText}` }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in generate-ranking-insights route:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
