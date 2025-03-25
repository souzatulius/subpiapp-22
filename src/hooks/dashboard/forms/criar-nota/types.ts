
import { Demand, DemandResponse } from '@/types/demand';

export interface CriarNotaFormProps {
  onClose: () => void;
}

// Re-export for convenience with correct export type syntax
export type { Demand, DemandResponse };
export type { ResponseQA } from '@/types/demand';
