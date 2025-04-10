
import { CardColor, CardType, DataSourceKey } from './dashboard';

export interface FormSchema {
  title: string;
  subtitle?: string;
  type?: CardType;
  path?: string;
  color: CardColor;
  iconId?: string;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  dataSourceKey?: DataSourceKey;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments?: string[];
  allowedRoles?: string[];
}
