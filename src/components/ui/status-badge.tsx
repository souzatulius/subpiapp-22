
import React from 'react';
import { StatusConfig } from '@/utils/statusLabels';

// Re-export all badge components
export { StatusBadge } from './badges/status-badge-base';
export { DemandaStatusBadge } from './badges/demanda-status-badge';
export { NotaStatusBadge } from './badges/nota-status-badge';
export { TemaBadge } from './badges/tema-badge';
export { CoordenacaoBadge } from './badges/coordenacao-badge';
export { PrioridadeBadge } from './badges/prioridade-badge';
export { ResponsabilidadeBadge } from './badges/responsabilidade-badge';
export type { BadgeSize } from './badges/badge-utils';

// For backward compatibility, re-export shared types
export type { StatusConfig };
