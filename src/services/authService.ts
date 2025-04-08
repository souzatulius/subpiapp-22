
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RegisterUserData {
  email: string;
  nome_completo: string;
  cargo?: string;
  RF?: string;
  coordenacao?: string;
}

/**
 * Registers a new user in the system by sending a request for access
 * This doesn't create an auth account but stores the request in the database
 * @param userData User registration data
 */
export const registerUser = async (userData: RegisterUserData) => {
  try {
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', userData.email)
      .single();
    
    if (existingUser) {
      throw new Error('Este email já está cadastrado no sistema.');
    }
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    // Insert the user registration request
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        email: userData.email,
        nome_completo: userData.nome_completo,
        cargo: userData.cargo || null,
        rf: userData.RF || null,
        coordenacao: userData.coordenacao || null,
        status: 'pendente',
      });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in registerUser:', error);
    throw new Error(error.message || 'Falha ao registrar usuário');
  }
}
