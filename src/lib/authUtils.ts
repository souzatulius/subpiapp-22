
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

// Format date from DD/MM/YYYY to YYYY-MM-DD for database storage
export const formatDateForDatabase = (dateString: string): string | null => {
  if (!dateString) return null;
  
  // Check if the date is already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // If it's in DD/MM/YYYY format, convert it
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  
  console.error('Invalid date format:', dateString);
  return null;
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
      errorMessage = 'Erro de banco de dados. Por favor, verifique os dados informados ou contate o suporte.';
    } else if (error.message.includes('User already registered')) {
      errorMessage = 'Email já registrado. Utilize outro email ou recupere sua senha.';
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
    console.log('Verificando aprovação do usuário:', userId);
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
    const isApproved = permissionsData !== null && permissionsData.length > 0;
    console.log('Usuário aprovado?', isApproved, 'Permissões:', permissionsData);
    return isApproved;
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
    console.log('Criando notificação para administradores sobre novo usuário:', { userId, userName, email });
    
    if (!userId || !userName || !email) {
      console.error('Dados incompletos para criar notificação:', { userId, userName, email });
      throw new Error('Dados incompletos para criar notificação');
    }
    
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
      if (cleanData[key] === undefined || cleanData[key] === null || cleanData[key] === '') {
        delete cleanData[key];
      }
    });
    
    // Ensure IDs are valid UUIDs or null
    if (cleanData.cargo_id && typeof cleanData.cargo_id === 'string' && !cleanData.cargo_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid cargo_id format:', cleanData.cargo_id);
      return { error: new Error('ID de cargo inválido') };
    }
    
    if (cleanData.supervisao_tecnica_id && typeof cleanData.supervisao_tecnica_id === 'string' && !cleanData.supervisao_tecnica_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid supervisao_tecnica_id format:', cleanData.supervisao_tecnica_id);
      return { error: new Error('ID de supervisão técnica inválido') };
    }
    
    if (cleanData.coordenacao_id && typeof cleanData.coordenacao_id === 'string' && !cleanData.coordenacao_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid coordenacao_id format:', cleanData.coordenacao_id);
      return { error: new Error('ID de coordenação inválido') };
    }
    
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
    
    console.log('Perfil do usuário atualizado com sucesso');
    return { error: null };
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    return { error };
  }
};
