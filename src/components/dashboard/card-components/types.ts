
// Import the necessary dependencies correctly
import { useSortable } from '@dnd-kit/sortable';

// Define the SortableProps type using the correct approach
export interface SortableProps {
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
  setNodeRef: ReturnType<typeof useSortable>['setNodeRef'];
}

// Add any other types that might be needed for card components
export interface CardComponentProps {
  id: string;
  title: string;
  content?: React.ReactNode;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
