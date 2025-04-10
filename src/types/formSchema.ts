
import { CardColor, CardType, DataSourceKey, CardWidth, CardHeight } from './dashboard';

export interface FormSchema {
  title: string;
  subtitle?: string;
  type?: CardType;
  path?: string;
  color: CardColor;
  iconId: string;
  width?: CardWidth;
  height?: CardHeight;
  dataSourceKey?: DataSourceKey;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments?: string[];
  allowedRoles?: string[];
}
