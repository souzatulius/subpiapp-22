
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
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("id, nome_completo, email")
      .eq("id", userId)
      .single();
      
    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    // Send email using Supabase Auth admin API
    const { error: emailError } = await supabase.auth.admin.createMessage({
      template_name: "approval",
      user_id: userData.id,
      subject: "Seu acesso foi aprovado",
      variables: {
        user_name: userData.nome_completo,
        application_name: "SMSUB - Sistema Integrado",
        login_url: `${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", ".vercel.app") || ""}/login`,
      },
    });

    if (emailError) throw emailError;
    
    console.log("Approval email sent successfully to user:", userData.email);
    
    return new Response(
      JSON.stringify({ success: true, message: "Approval email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending approval email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Error sending approval email" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
