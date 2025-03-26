
import { User } from '@supabase/supabase-js';

export interface UsePermissionsReturn {
  isAdmin: boolean;
  userCoordination: string | null;
  userSupervisaoTecnica: string | null;
  isLoading: boolean;
  error: Error | null;
  loading: boolean;
  canAccessProtectedRoute: (route: string) => boolean;
}

export interface UserData {
  coordenacaoId: string | null;
  supervisaoTecnicaId: string | null;
}
