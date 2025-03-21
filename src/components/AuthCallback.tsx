
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get URL hash parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorDescription = hashParams.get('error_description');
      
      if (errorDescription) {
        console.error('Error from OAuth provider:', errorDescription);
        
        // Show an appropriate error message
        if (errorDescription.includes('domain_mismatch')) {
          setError('A conta Google utilizada não pertence ao domínio @smsub.prefeitura.sp.gov.br');
          toast({
            title: "Erro de domínio",
            description: "Por favor, utilize uma conta Google do domínio @smsub.prefeitura.sp.gov.br",
            variant: "destructive"
          });
        } else {
          setError('Erro na autenticação com Google');
          toast({
            title: "Erro de autenticação",
            description: errorDescription,
            variant: "destructive"
          });
        }
        
        // Navigate back to login after a short delay
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Handle successful authentication
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro no callback de autenticação:', error);
        setError(error.message);
        toast({
          title: "Erro de autenticação",
          description: error.message,
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      if (data?.session) {
        // Check if user email matches the organization domain
        const userEmail = data.session.user?.email || '';
        if (!userEmail.endsWith('@smsub.prefeitura.sp.gov.br')) {
          console.warn('Email domain not allowed:', userEmail);
          await supabase.auth.signOut(); // Sign out the user
          setError('Apenas emails do domínio @smsub.prefeitura.sp.gov.br são permitidos');
          toast({
            title: "Domínio não permitido",
            description: "Apenas emails do domínio @smsub.prefeitura.sp.gov.br são permitidos",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo(a) de volta!",
        });
        navigate('/dashboard');
      } else {
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
