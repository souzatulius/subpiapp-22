export interface ActionCardItem {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: string;
  width: string;
  height: string;
  type?: string;
  isHidden?: boolean;
  isCustom?: boolean;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  mobileOrder?: number;
  displayMobile?: boolean;
  hasBadge?: boolean;
  badgeValue?: string;
  textColor?: string; // Add this property
}
