import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const showAuthError = (error: any) => {
  let message = 'Ocorreu um erro desconhecido';
  
  if (error.message) {
    if (error.message.includes('already registered')) {
      message = 'Este email já está registrado no sistema';
    } else if (error.message.includes('email')) {
      message = 'Por favor, forneça um email válido';
    } else if (error.message.includes('password')) {
      message = 'A senha não atende aos requisitos mínimos de segurança';
    } else {
      message = error.message;
    }
  }
  
  toast.error(message);
};

export const completeEmailWithDomain = (email: string): string => {
  if (!email.includes('@')) {
    return `${email}@smsub.prefeitura.sp.gov.br`;
  }
  return email;
};

export const formatDateForDatabase = (dateString: string): string | null => {
  if (!dateString) return null;
  
  // Parse DD/MM/YYYY to YYYY-MM-DD
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  // Basic validation
  if (isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

export const createAdminNotification = async (userId: string, userName: string, userEmail: string) => {
  try {
    // Create a notification for all admin users about the new registration
    const { error } = await fetch('/api/notifications/create-admin-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Novo usuário registrado: ${userName} (${userEmail})`,
        userId,
        type: 'user_registered'
      })
    }).then(res => res.json());
    
    if (error) throw error;
  } catch (error) {
    console.error('Error creating admin notification:', error);
  }
};

export const isUserApproved = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('status_conta')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking user approval status:', error);
      return false;
    }
    
    return data?.status_conta === 'aprovado' || data?.status_conta === 'ativo';
  } catch (error) {
    console.error('Failed to check user approval status:', error);
    return false;
  }
};

export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    // Format aniversario if it exists and is in DD/MM/YYYY format
    let formattedData = { ...userData };
    
    if (userData.aniversario) {
      const formattedDate = formatDateForDatabase(userData.aniversario);
      if (formattedDate) {
        formattedData.aniversario = formattedDate;
      }
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .update(formattedData)
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating user profile:', error);
      return { error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Exception during profile update:', error);
    return { error };
  }
};
