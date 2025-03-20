
import { User, Permission } from '../types';
import { exportToCsv, printAccessControl } from '../accessControlUtils';

export const useAccessControlExport = (
  users: User[],
  permissions: Permission[],
  userPermissions: Record<string, string[]>
) => {
  // Export to CSV
  const handleExportCsv = () => {
    exportToCsv(users, permissions, userPermissions);
  };

  // Print
  const handlePrint = () => {
    printAccessControl();
  };

  return {
    handleExportCsv,
    handlePrint
  };
};
