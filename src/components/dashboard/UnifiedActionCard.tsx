
import React from 'react';
import { CardContentProps } from './card-components/types';
import SortableCardWrapper from './card-components/SortableCardWrapper';
import UnifiedActionCardContent from './card-components/UnifiedActionCardContent';
import Controls from './card-components/Controls';

export { Controls };
export type { CardContentProps };

export function SortableUnifiedActionCard(props: CardContentProps) {
  return <SortableCardWrapper {...props} />;
}

export function UnifiedActionCard(props: CardContentProps) {
  return <UnifiedActionCardContent {...props} />;
}

export default UnifiedActionCard;
