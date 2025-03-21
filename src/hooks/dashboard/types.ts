
import { ReactNode } from 'react';

// Define interface for our user_dashboard table
export interface UserDashboard {
  id: string;
  user_id: string;
  cards_config: string; // JSON stored as string
  created_at: string;
  updated_at: string;
}

// Interface for serializableCard format
export interface SerializableCard {
  id: string;
  title: string;
  path: string;
  color: string;
  iconId: string;
  width?: string;
  height?: string;
  isCustom?: boolean;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
}

// Interface for dashboard hook return values
export interface DashboardStateReturn {
  firstName: string;
  actionCards: ActionCardItem[];
  setActionCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (isOpen: boolean) => void;
  editingCard: ActionCardItem | null;
  handleDeleteCard: (id: string) => void;
  handleAddNewCard: () => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleSaveCard: (cardData: Omit<ActionCardItem, 'id'>) => void;
  // Quick demand functionality
  newDemandTitle: string;
  setNewDemandTitle: (value: string) => void;
  handleQuickDemandSubmit: () => void;
  // Search functionality
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearchSubmit: (query: string) => void;
}

// Import ActionCardItem to avoid circular dependency
export interface ActionCardItem {
  id: string;
  title: string;
  icon: ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light';
  isCustom?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
}
