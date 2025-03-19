
import { toast } from '@/components/ui/use-toast';

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
