
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
    const firebaseServerKey = Deno.env.get("FIREBASE_SERVER_KEY") || "";
    
    if (!firebaseServerKey) {
      throw new Error("Firebase server key is not set");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const { userId, title, body, data } = await req.json();
    
    if (!userId || !title || !body) {
      throw new Error("User ID, title, and body are required");
    }
    
    // Get user's FCM tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens_notificacoes")
      .select("fcm_token")
      .eq("user_id", userId);
      
    if (tokenError) throw tokenError;
    
    if (!tokenData?.length) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No FCM tokens found for user" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Extract tokens
    const tokens = tokenData.map(t => t.fcm_token);
    
    // Send push notification to all user devices
    const responses = await Promise.all(tokens.map(async (token) => {
      const payload = {
        notification: {
          title,
          body,
          icon: "/lovable-uploads/003ae508-4951-4978-a94b-35490e166867.png",
          click_action: `${supabaseUrl.replace(".supabase.co", ".vercel.app")}`,
        },
        data: data || {},
        to: token
      };
      
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${firebaseServerKey}`,
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      return { token, result };
    }));
    
    // Check for and remove invalid tokens
    const invalidTokens = responses.filter(
      r => r.result.failure === 1 && 
      r.result.results && 
      r.result.results[0].error && 
      (r.result.results[0].error === "InvalidRegistration" || 
       r.result.results[0].error === "NotRegistered")
    ).map(r => r.token);
    
    if (invalidTokens.length > 0) {
      console.log("Removing invalid tokens:", invalidTokens);
      await supabase
        .from("tokens_notificacoes")
        .delete()
        .in("fcm_token", invalidTokens);
    }
    
    console.log("Push notification responses:", responses);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Push notifications sent to ${tokens.length - invalidTokens.length} devices` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Error sending push notification" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
