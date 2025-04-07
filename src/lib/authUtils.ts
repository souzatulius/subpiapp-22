
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Format an email to include the domain if it's not already present
export const completeEmailWithDomain = (email: string): string => {
  if (!email) return '';
  // If the email already has a domain, return it as is
  if (email.includes('@')) return email;
  // Otherwise, append the domain
  return `${email}@smsub.prefeitura.sp.gov.br`;
};

// Show an error message from auth operations
export const showAuthError = (error: any) => {
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
    } else if (error.message.includes('Database error')) {
      errorMessage = 'Erro de banco de dados. Por favor, tente novamente ou contate o suporte.';
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
  try {
    // Check if the user has permissions, which indicates approval
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('usuario_permissoes')
      .select('permissao_id')
      .eq('usuario_id', userId);
    
    if (permissionsError) {
      console.error('Erro ao verificar permissões do usuário:', permissionsError);
      return false;
    }
    
    // If the user has any permissions assigned, consider them approved
    return permissionsData !== null && permissionsData.length > 0;
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
  try {
    // Create a notification in the notifications table
    const { error } = await supabase.from('notificacoes').insert({
      mensagem: `${userName} (${email}) solicitou acesso ao sistema.`,
      tipo: 'user_registration',
      usuario_id: userId,
      referencia_tipo: 'usuario',
    });
    
    if (error) {
      console.error('Erro ao criar notificação de registro:', error);
      throw error;
    }
    
    console.log('Notificação de novo registro criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar notificação de registro:', error);
    throw error;
  }
};

// Update user profile data
export const updateUserProfile = async (userId: string, userData: any): Promise<{ error: any | null }> => {
  if (!userId) {
    console.error('updateUserProfile: userId not provided');
    return { error: new Error('ID de usuário não fornecido') };
  }
  
  try {
    console.log('Atualizando dados do perfil com:', userData);
    
    // Clean data before update
    const cleanData = { ...userData };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });
    
    // Update user profile in the usuarios table
    const { error } = await supabase
      .from('usuarios')
      .update({
        nome_completo: cleanData.nome_completo,
        aniversario: cleanData.aniversario,
        whatsapp: cleanData.whatsapp,
        cargo_id: cleanData.cargo_id,
        supervisao_tecnica_id: cleanData.supervisao_tecnica_id,
        coordenacao_id: cleanData.coordenacao_id,
        status: 'pendente', // Explicitly set status as 'pendente'
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
