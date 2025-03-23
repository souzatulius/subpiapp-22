
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
    const { userId, subject, content, notificationType } = await req.json();
    
    if (!userId || !subject || !content) {
      throw new Error("User ID, subject, and content are required");
    }
    
    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("id, nome_completo, email, configuracoes_notificacao")
      .eq("id", userId)
      .single();
      
    if (userError) throw userError;
    if (!userData) throw new Error("User not found");
    
    // Check if user wants email notifications
    const userPreferences = userData.configuracoes_notificacao || { email: true };
    if (!userPreferences.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "User has disabled email notifications" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Send email using Supabase Auth admin API
    const { error: emailError } = await supabase.auth.admin.createMessage({
      template_name: "notification",
      user_id: userData.id,
      subject: subject,
      variables: {
        user_name: userData.nome_completo,
        notification_content: content,
        notification_type: notificationType || "Notificação do Sistema",
        app_url: Deno.env.get("FRONTEND_URL") || supabaseUrl.replace(".supabase.co", ".vercel.app"),
      },
    });

    if (emailError) throw emailError;
    
    console.log("Notification email sent successfully to user:", userData.email);
    
    // Store the notification in the database
    const { error: notificationError } = await supabase
      .from('notificacoes')
      .insert({
        usuario_id: userId,
        mensagem: content,
        tipo: notificationType || "email",
        lida: false
      });
      
    if (notificationError) {
      console.error("Error storing notification:", notificationError);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Notification email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending notification email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Error sending notification email" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
