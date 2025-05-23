export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export function getSizeClasses(size: BadgeSize): string {
  switch (size) {
    case 'xs':
      return 'px-1.5 py-0.5 text-xs';
    case 'sm':
      return 'px-2 py-1 text-xs';
    case 'md':
      return 'px-2.5 py-1 text-sm';
    case 'lg':
      return 'px-3 py-1.5 text-sm';
    default:
      return 'px-2 py-1 text-xs';
  }
}

export function getIconSize(size: BadgeSize): number {
  switch (size) {
    case 'xs':
      return 12;
    case 'sm':
      return 14;
    case 'md':
      return 16;
    case 'lg':
      return 18;
    default:
      return 14;
  }
}

// Helper for formatting status labels with capitalization
export const formatStatusLabel = (status: string): string => {
  // If the status contains underscores, replace with spaces and format each word
  if (status.includes('_')) {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Otherwise, just capitalize the first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
};
