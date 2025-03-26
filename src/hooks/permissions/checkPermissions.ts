
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserData } from './types';

/**
 * Checks if user has a specific role in the database
 */
export const checkUserRole = async (userId: string, roleName: string): Promise<boolean> => {
  try {
    console.log(`Checking if user ${userId} has role: ${roleName}`);
    const { data: hasRole, error } = await supabase
      .rpc('user_has_role', {
        _user_id: userId,
        _role_nome: roleName
      });
    
    if (error) {
      console.error(`Error checking if user has role ${roleName}:`, error);
      return false;
    }
    
    console.log(`User ${userId} has role ${roleName}: ${Boolean(hasRole)}`);
    return Boolean(hasRole);
  } catch (err) {
    console.error(`Exception checking if user has role ${roleName}:`, err);
    return false;
  }
};

/**
 * Fetches user's coordination and supervisao tecnica IDs
 */
export const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    console.log(`Fetching data for user ${userId}`);
    const { data, error } = await supabase
      .from('usuarios')
      .select('coordenacao_id, supervisao_tecnica_id')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error(`Error fetching user data for ${userId}:`, error);
      return { coordenacaoId: null, supervisaoTecnicaId: null };
    }
    
    console.log(`User data retrieved:`, data);
    return { 
      coordenacaoId: data?.coordenacao_id || null, 
      supervisaoTecnicaId: data?.supervisao_tecnica_id || null 
    };
  } catch (err) {
    console.error(`Exception fetching user data for ${userId}:`, err);
    return { coordenacaoId: null, supervisaoTecnicaId: null };
  }
};

/**
 * Checks if user belongs to a privileged coordination
 */
export const checkCoordinationPrivileges = async (coordenacaoId: string): Promise<boolean> => {
  if (!coordenacaoId) return false;
  
  try {
    console.log(`Checking privileges for coordination ${coordenacaoId}`);
    const { data, error } = await supabase
      .from('coordenacoes')
      .select('descricao')
      .eq('id', coordenacaoId)
      .single();
    
    if (error) {
      console.error(`Error fetching coordination data for ${coordenacaoId}:`, error);
      return false;
    }
    
    if (!data?.descricao) {
      console.log(`No description found for coordination ${coordenacaoId}`);
      return false;
    }
    
    // Normalize the coordination description to handle accents and variations
    const normalized = data.descricao
      .normalize("NFD")                
      .replace(/[\u0300-\u036f]/g, "")  
      .toLowerCase()
      .trim();
    
    console.log(`Coordination description: "${data.descricao}"`);
    console.log(`Normalized description: "${normalized}"`);
    
    // Check for privileged coordinations using normalized string
    const isPrivileged = normalized.includes('gabinete') || normalized.includes('comunicacao');
    console.log(`Coordination ${coordenacaoId} is privileged: ${isPrivileged}`);
    
    return isPrivileged;
  } catch (err) {
    console.error(`Exception checking coordination privileges for ${coordenacaoId}:`, err);
    return false;
  }
};

/**
 * Checks if user has legacy admin permissions
 */
export const checkLegacyPermissions = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Checking legacy permissions for user ${userId}`);
    const { data: isAdmin, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error(`Error checking legacy permissions for ${userId}:`, error);
      return false;
    }
    
    console.log(`User ${userId} has legacy admin permissions: ${Boolean(isAdmin)}`);
    return Boolean(isAdmin);
  } catch (err) {
    console.error(`Exception checking legacy permissions for ${userId}:`, err);
    return false;
  }
};

/**
 * Checks if user is admin by coordination
 */
export const checkAdminByCoordination = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Checking admin by coordination for user ${userId}`);
    const { data: isAdmin, error } = await supabase
      .rpc('is_admin_by_coordenacao', { user_id: userId });
    
    if (error) {
      console.error(`Error checking admin by coordination for ${userId}:`, error);
      return false;
    }
    
    console.log(`User ${userId} is admin by coordination: ${Boolean(isAdmin)}`);
    return Boolean(isAdmin);
  } catch (err) {
    console.error(`Exception checking admin by coordination for ${userId}:`, err);
    return false;
  }
};
