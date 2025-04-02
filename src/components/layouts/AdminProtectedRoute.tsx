
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Não prosseguir até que a autenticação seja carregada
    
    const checkAccess = async () => {
      console.log("Verificando acesso à rota administrativa:", location.pathname);
      
      if (!user) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      try {
        // Obter a coordenação do usuário
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        // Se o usuário tem uma coordenação, verificar se tem permissão
        if (userData?.coordenacao_id) {
          // Simplificando para permitir acesso total a todos os usuários conforme solicitado
          setHasAccess(true);
          setAccessChecked(true);
        } else {
          // Usuário sem coordenação ainda tem acesso (conforme solicitado - todos têm acesso total)
          setHasAccess(true);
          setAccessChecked(true);
        }
      } catch (err) {
        console.error("Erro ao verificar permissões:", err);
        // Em caso de erro, conceder acesso (conforme solicitado - todos têm acesso total)
        setHasAccess(true);
        setAccessChecked(true);
      }
    };
    
    checkAccess();
  }, [
    user,
    authLoading,
    navigate,
    location.pathname,
  ]);

  if (authLoading || !accessChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!user || !hasAccess) {
    return null; // Não renderizar nada enquanto aguarda o redirecionamento
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
