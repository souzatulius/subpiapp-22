
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import UserProfileView from '@/components/profile/UserProfileView';
import { useIsMobile } from '@/hooks/use-mobile';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ProfileData } from '@/components/profile/types';

const UserProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    // Simulating data loading
    const loadProfileData = async () => {
      if (user) {
        try {
          setLoading(true);
          // This would normally be a call to your API or database
          // For now, we'll just set some mock data
          setTimeout(() => {
            setUserProfile({
              nome_completo: user.user_metadata?.full_name || 'Usuário',
              email: user.email || '',
              cargo: user.user_metadata?.cargo || 'Não informado',
              coordenacao: user.user_metadata?.coordenacao || 'Não informado',
              whatsapp: user.user_metadata?.whatsapp || '',
              foto_perfil_url: user.user_metadata?.avatar_url || '',
              aniversario: null
            });
            setLoading(false);
          }, 500);
        } catch (error) {
          console.error('Error loading profile data', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1">
          {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
          
          <main 
            className="flex-1"
            style={{
              backgroundImage: 'url("/lovable-uploads/d623f576-9d17-4166-83a8-824bc438a8bf.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {!isMobile && <BreadcrumbBar />}
            
            <div className="container max-w-7xl mx-auto">
              <div className={`p-4 ${isMobile ? 'pb-16' : 'pb-4'}`}>
                {isMobile && <BreadcrumbBar />}
                <UserProfileView userProfile={userProfile} loading={loading} />
              </div>
            </div>
          </main>
        </div>
        
        {isMobile && <MobileBottomNav />}
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
