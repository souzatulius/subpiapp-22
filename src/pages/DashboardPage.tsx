
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useAuth } from '@/hooks/useSupabaseAuth';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

const DashboardPage: React.FC = () => {
  const { user, isLoading, isApproved } = useAuth();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to email verification page if not approved
  if (!isApproved) {
    return <Navigate to="/email-verified" />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeMessage />
        <UnifiedCardGrid />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
