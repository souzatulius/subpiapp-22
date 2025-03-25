
// Format an email to include the domain if it's not already present
export const completeEmailWithDomain = (email: string): string => {
  const emailDomain = '@smsub.prefeitura.sp.gov.br';
  
  if (!email.includes('@')) {
    return `${email}${emailDomain}`;
  }
  
  return email;
};

// Show an error message from auth operations
export const showAuthError = (error: any) => {
  // Use the toast component to show the error
  const { toast } = require('@/components/ui/use-toast');
  
  let errorMessage = 'Erro ao processar a solicitação';
  
  if (error?.message) {
    // Map auth error messages to more user-friendly messages
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Email ou senha inválidos. Por favor, verifique suas credenciais.';
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Email não confirmado. Por favor, verifique seu email para confirmar sua conta.';
    } else if (error.message.includes('User not approved')) {
      errorMessage = 'Sua conta ainda não foi aprovada. Aguarde a aprovação de um administrador.';
    } else if (error.message.includes('Rate limit')) {
      errorMessage = 'Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.';
    } else {
      errorMessage = error.message;
    }
  }
  
  toast({
    title: 'Erro',
    description: errorMessage,
    variant: 'destructive',
  });
};

// Check if a user is approved to access the system
export const isUserApproved = async (userId: string): Promise<boolean> => {
  const { supabase } = require('@/integrations/supabase/client');
  
  try {
    // Query the 'usuarios' table to check if the user is approved
    const { data, error } = await supabase
      .from('usuarios')
      .select('aprovado')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Erro ao verificar aprovação do usuário:', error);
      return false;
    }
    
    return data?.aprovado === true;
  } catch (error) {
    console.error('Erro ao verificar aprovação do usuário:', error);
    return false;
  }
};

// Create a notification for admins about a new user registration
export const createAdminNotification = async (
  userId: string,
  userName: string,
  email: string
): Promise<void> => {
  const { supabase } = require('@/integrations/supabase/client');
  
  try {
    // Create a notification in the notifications table
    await supabase.from('notificacoes').insert({
      titulo: 'Novo usuário registrado',
      mensagem: `${userName} (${email}) solicitou acesso ao sistema.`,
      tipo: 'user_registration',
      user_id: userId,
      for_admins: true,
    });
    
    console.log('Notificação de novo registro criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar notificação de registro:', error);
  }
};

// Update user profile data
export const updateUserProfile = async (userId: string, userData: any): Promise<{ error: any | null }> => {
  const { supabase } = require('@/integrations/supabase/client');
  
  try {
    // Update user profile in the usuarios table
    const { error } = await supabase
      .from('usuarios')
      .update({
        nome_completo: userData.nome_completo,
        aniversario: userData.aniversario,
        whatsapp: userData.whatsapp,
        cargo_id: userData.cargo_id,
        area_coordenacao_id: userData.area_coordenacao_id,
        coordenacao_id: userData.coordenacao_id,
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    return { error };
  }
};
