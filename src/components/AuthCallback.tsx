
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
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
      const errorType = hashParams.get('error') || queryParams.get('error');
      
      console.log("URL parameters:", { 
        hash: Object.fromEntries(hashParams.entries()),
        query: Object.fromEntries(queryParams.entries()),
        errorType,
        errorDescription,
        url: window.location.href
      });
      
      if (errorType || errorDescription) {
        console.error('Error from OAuth provider:', { errorType, errorDescription });
        
        let userMessage = 'Erro na autenticação com Google';
        let errorDetailsMsg = errorDescription || 'Detalhes não disponíveis';
        
        // Customize messages based on error type
        if (errorDescription?.includes('domain_mismatch') || errorType === 'access_denied') {
          userMessage = 'A conta Google utilizada não pertence ao domínio @smsub.prefeitura.sp.gov.br';
          errorDetailsMsg = 'Por favor, utilize uma conta Google do domínio @smsub.prefeitura.sp.gov.br';
        } else if (errorType === 'unauthorized_client') {
          userMessage = 'Configuração de autenticação inválida';
          errorDetailsMsg = 'O cliente OAuth não está configurado corretamente. Entre em contato com o administrador.';
        } else if (errorType === 'access_denied') {
          userMessage = 'Acesso negado';
          errorDetailsMsg = 'A permissão para acessar o recurso foi negada.';
        }
        
        setError(userMessage);
        setErrorDetails(errorDetailsMsg);
        setProcessingAuth(false);
        
        toast.error("Erro de autenticação", {
          description: userMessage
        });
        
        // Navigate back to login after a short delay
        setTimeout(() => navigate('/login'), 5000);
        return;
      }

      console.log("No error params found, proceeding with auth check");

      // Handle successful authentication
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro no callback de autenticação:', error);
        setError('Falha ao verificar sessão');
        setErrorDetails(error.message);
        setProcessingAuth(false);
        
        toast.error("Erro de autenticação", {
          description: error.message
        });
        
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (data?.session) {
        // Check if user email matches the organization domain
        const userEmail = data.session.user?.email || '';
        console.log("Authenticated user email:", userEmail);
        
        if (!userEmail.endsWith('@smsub.prefeitura.sp.gov.br')) {
          console.warn('Email domain not allowed:', userEmail);
          await supabase.auth.signOut(); // Sign out the user
          
          setError('Apenas emails do domínio @smsub.prefeitura.sp.gov.br são permitidos');
          setErrorDetails(`Email utilizado: ${userEmail}`);
          setProcessingAuth(false);
          
          toast.error("Domínio não permitido", {
            description: "Apenas emails do domínio @smsub.prefeitura.sp.gov.br são permitidos"
          });
          
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        console.log("Authentication successful, redirecting to dashboard");
        toast.success("Login realizado com sucesso", {
          description: "Bem-vindo(a) de volta!"
        });
        navigate('/dashboard');
      } else {
        console.log("No session found, redirecting to login");
        setProcessingAuth(false);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {error ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro de autenticação</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          {errorDetails && (
            <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
              <p className="text-gray-600">{errorDetails}</p>
            </div>
          )}
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#003570] text-white py-2 rounded-lg hover:bg-blue-900 transition-all"
          >
            Voltar para o login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="loading-spinner animate-spin mb-4 w-10 h-10 border-4 border-[#003570] border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Autenticando, por favor aguarde...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
