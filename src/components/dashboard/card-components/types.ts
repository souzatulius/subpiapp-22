
// Import the necessary dependencies correctly
import { UseSortableArguments, UseSortableReturn } from '@dnd-kit/sortable';

// Define the SortableProps type without using ReturnType
export interface SortableProps {
  attributes: UseSortableReturn['attributes'];
  listeners: UseSortableReturn['listeners'];
  setNodeRef: UseSortableReturn['setNodeRef'];
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
