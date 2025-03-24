import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const formatAuthError = (error: any): string => {
  const errorMessage = error?.message || 'Ocorreu um erro. Tente novamente.';
  
  // Mapeamento de mensagens de erro em inglês para português
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Credenciais de login inválidas',
    'Email not confirmed': 'E-mail ainda não confirmado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'User already registered': 'Este e-mail já está em uso',
    'Email format is invalid': 'Formato de e-mail inválido',
    'Signup disabled': 'O cadastro está temporariamente desativado',
    'Too many requests': 'Muitas tentativas. Tente novamente mais tarde',
    'Password recovery mail sent recently': 'E-mail de recuperação enviado recentemente',
    'Service unavailable': 'Serviço indisponível no momento',
    'User not approved': 'Seu cadastro está em aprovação. Aguarde a liberação do acesso por um administrador.',
  };

  // Verificar se há uma tradução para o erro ou usar a mensagem original
  return errorMap[errorMessage] || errorMessage;
};

export const showAuthError = (error: any): void => {
  const message = formatAuthError(error);
  
  toast({
    title: "Erro",
    description: message,
    variant: "destructive"
  });
};

export const completeEmailWithDomain = (email: string): string => {
  if (!email) return '';
  if (email.includes('@')) return email;
  return `${email}@smsub.prefeitura.sp.gov.br`;
};

export const isUserApproved = async (userId: string): Promise<boolean> => {
  try {
    // Check if user has been assigned any permissions in usuario_permissoes table
    const { data, error } = await supabase
      .from('usuario_permissoes')
      .select('id')
      .eq('usuario_id', userId)
      .limit(1);
      
    if (error) throw error;
    
    // If user has any permissions, they are considered approved
    return data && data.length > 0;
  } catch (error) {
    console.error('Erro ao verificar status de aprovação:', error);
    return false;
  }
};

export const createAdminNotification = async (userId: string, userName: string, userEmail: string): Promise<void> => {
  try {
    // Get all admin users by invoking the edge function
    const { data: admins, error: adminsError } = await supabase.functions.invoke('get_users_with_permission', {
      body: { permission_desc: 'Admin' }
    });
    
    if (adminsError) throw adminsError;
    
    // Create notification for each admin
    if (admins && Array.isArray(admins) && admins.length > 0) {
      for (const admin of admins) {
        await supabase
          .from('notificacoes')
          .insert({
            usuario_id: admin.id,
            mensagem: `Novo usuário ${userName} (${userEmail}) aguardando aprovação.`,
            tipo: 'aprovacao'
          });
      }
    }
  } catch (error) {
    console.error('Erro ao criar notificações para admins:', error);
  }
};

export const sendApprovalEmail = async (userId: string): Promise<void> => {
  try {
    // Invoke the edge function to send approval email
    const { error } = await supabase.functions.invoke('send-approval-email', {
      body: { userId }
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao enviar e-mail de aprovação:', error);
  }
};

export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    // Update user profile in usuarios table
    const { error } = await supabase
      .from('usuarios')
      .upsert({
        id: userId,
        nome_completo: userData.nome_completo,
        email: userData.email,
        aniversario: userData.aniversario,
        whatsapp: userData.whatsapp,
        cargo_id: userData.cargo_id,
        area_coordenacao_id: userData.area_coordenacao_id
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
