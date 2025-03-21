
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import { ClipboardList, MessageSquareReply, FileCheck, BarChart2 } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [firstName, setFirstName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Extract the first name from the user's full name
    if (user) {
      const fetchUserName = async () => {
        try {
          const { data: userData, error } = await supabase
            .from('usuarios')
            .select('nome_completo')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;

          // Get the first name only
          const fullName = userData?.nome_completo || '';
          const firstNameOnly = fullName.split(' ')[0];
          setFirstName(firstNameOnly);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserName();
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Notification permission request */}
            <NotificationsEnabler />
            
            <div className="mb-6">
              <h3 className="mb-2 text-3xl font-bold text-slate-950">Olá, {firstName || 'Usuário'}!</h3>
              <h1 className="text-2xl font-bold text-gray-800"></h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ActionCard 
                title="Nova Demanda" 
                icon={<ClipboardList className="h-6 w-6" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/cadastrar'} 
                color="blue" 
              />
              
              <ActionCard 
                title="Responder Demandas" 
                icon={<MessageSquareReply className="h-6 w-6" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/responder'} 
                color="green" 
              />
              
              <ActionCard 
                title="Aprovar Nota" 
                icon={<FileCheck className="h-6 w-6" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/aprovar-nota'} 
                color="orange" 
              />
              
              <ActionCard 
                title="Números da Comunicação" 
                icon={<BarChart2 className="h-6 w-6" />} 
                onClick={() => window.location.href = '/dashboard/comunicacao/relatorios'} 
                color="purple" 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
