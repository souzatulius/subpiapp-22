
// This file is kept for backward compatibility
// It re-exports the AuthProvider and useAuth from their new locations

import { AuthProvider } from '@/providers/AuthProvider';
import { useAuth } from '@/contexts/AuthContext';

export { AuthProvider, useAuth };
