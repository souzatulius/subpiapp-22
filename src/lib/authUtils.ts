
import { toast } from 'sonner';

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
