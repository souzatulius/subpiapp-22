
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const { permission_desc } = await req.json();
    
    if (!permission_desc) {
      throw new Error("Permission description is required");
    }
    
    // Get users with specified permission
    const { data, error } = await supabase
      .from('usuario_permissoes')
      .select(`
        usuario_id: usuarios!usuario_id(id, nome_completo, email),
        permissao: permissoes!permissao_id(id, descricao)
      `)
      .eq('permissoes.descricao', permission_desc);
      
    if (error) throw error;
    
    // Format the result
    const users = data.map(item => {
      return {
        id: item.usuario_id.id,
        nome_completo: item.usuario_id.nome_completo,
        email: item.usuario_id.email
      };
    });
    
    return new Response(
      JSON.stringify(users),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting users with permission:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Error getting users with permission" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
