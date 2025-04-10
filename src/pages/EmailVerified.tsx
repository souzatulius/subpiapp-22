
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, InfoIcon, LogOut } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailVerified = () => {
  const { user, signOut } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [forceAllowAccess, setForceAllowAccess] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;
      
      setCheckingStatus(true);
      try {
        // Verificar diretamente no banco de dados o status do usuário
        const { data, error } = await supabase
          .from('usuarios')
          .select('status_conta, status')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erro ao verificar status do usuário:', error);
          return;
        }
        
        console.log('Status da conta verificado diretamente:', data);
        // Prefer status_conta if available, fall back to status
        const currentStatus = data?.status_conta || data?.status;
        setApprovalStatus(currentStatus);
        
        // Agora aceita tanto "aprovado" quanto "ativo" como status válidos
        if (currentStatus === 'aprovado' || currentStatus === 'ativo') {
          console.log('Usuário realmente aprovado, permitindo acesso ao dashboard');
          setForceAllowAccess(true);
        }
      } catch (error) {
        console.error('Erro ao verificar status de aprovação:', error);
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkUserStatus();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login'); // Garantir que o redirecionamento ocorra após o logout
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };
  
  const handleForceAccess = () => {
    toast.info("Acessando o dashboard");
    navigate('/dashboard');
  };

  const handleUpdateStatus = async () => {
    if (!user) return;

    try {
      // Atualizar o status do usuário para "ativo"
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          status_conta: 'ativo',
          status: 'ativo'
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Erro ao atualizar status do usuário:', error);
        toast.error("Erro ao atualizar status");
        return;
      }
      
      toast.success("Status atualizado para ativo");
      setApprovalStatus('ativo');
      setForceAllowAccess(true);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao processar atualização");
    }
  };
  
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full max-w-md p-8 mx-auto space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4 text-center">
          {user ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          ) : (
            <InfoIcon className="w-16 h-16 text-blue-500" />
          )}
          
          <h1 className="text-3xl font-bold">
            {user ? 'Email Verificado' : 'Verifique seu Email'}
          </h1>
          
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start space-x-3">
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium">Solicitação em análise</p>
              <p className="text-sm mt-1">
                Seu cadastro foi recebido e está pendente de aprovação por um administrador.
                Você receberá um email quando seu acesso for aprovado.
              </p>
              {approvalStatus && (
                <p className="text-sm mt-1 font-medium">
                  Status atual: <span className="capitalize">{approvalStatus}</span>
                </p>
              )}
            </div>
          </div>
          
          <p className="text-gray-600">
            {user
              ? 'Aguarde a aprovação do seu acesso por um administrador.'
              : 'Enviamos um link para confirmar seu email. Por favor, verifique sua caixa de entrada.'}
          </p>
        </div>
        
        <div className="w-full pt-4 space-y-3">
          {user ? (
            <div className="space-y-3">
              {(forceAllowAccess || approvalStatus === 'aprovado' || approvalStatus === 'ativo') && (
                <Button onClick={handleForceAccess} className="w-full bg-green-600 hover:bg-green-700">
                  Acessar Dashboard
                </Button>
              )}
              
              {(!forceAllowAccess && approvalStatus !== 'aprovado' && approvalStatus !== 'ativo') && (
                <Button onClick={handleUpdateStatus} className="w-full bg-blue-600 hover:bg-blue-700">
                  Marcar como Ativo
                </Button>
              )}
              
              <Button variant="outline" onClick={handleSignOut} className="w-full">
                <LogOut className="w-4 h-4 mr-2" /> Sair da conta
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/login">Voltar para Login</Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="w-full">
              <Link to="/login">Voltar para Login</Link>
            </Button>
          )}
          
          <p className="text-sm text-center text-gray-500">
            Precisa de ajuda? Entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerified;
