
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processingAuth, setProcessingAuth] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback handler triggered");
      setProcessingAuth(true);
      
      // Get URL hash parameters and query parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Check for errors in both hash and query parameters
      const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
      
      if (errorDescription) {
        console.error('Error during authentication flow:', errorDescription);
        setError(errorDescription);
        setProcessingAuth(false);
        return;
      }
      
      // Check for email verification parameters
      const type = hashParams.get('type') || queryParams.get('type');
      
      try {
        if (type === 'email_confirmation' || type === 'recovery') {
          // This is an email verification flow
          // No need to process further as AuthProvider will handle the redirect
          console.log('Detected email verification flow, redirecting to email-verified page');
          
          // If email was verified, update the usuario status
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              console.log('Updating confirmed email user status:', session.user.id);
              
              // Update the user's status_conta to 'pendente' (awaiting approval)
              await supabase
                .from('usuarios')
                .update({ status_conta: 'pendente' })
                .eq('id', session.user.id);
            }
          } catch (updateError) {
            console.error('Error updating user status after verification:', updateError);
          }
          
          navigate('/email-verified');
          return;
        }
        
        // Handle other auth callback cases
        // The session should already be set by Supabase auth
        console.log('Processing general auth callback');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError('Erro ao processar autenticação. Por favor, tente novamente.');
      } finally {
        setProcessingAuth(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro de Autenticação</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">Processando autenticação...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
