
import { UserProfile } from '@/types/common';

export interface ProfileData {
  nome_completo: string;
  whatsapp?: string;
  aniversario?: Date | string;
}

// Re-export UserProfile for convenience
export type { UserProfile };
