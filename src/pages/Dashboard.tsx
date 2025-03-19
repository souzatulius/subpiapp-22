
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import { ClipboardList, FileText, BarChart2, Users, FileCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

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
    <div className="page-container bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="content-container">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 w-full overflow-auto p-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-6">
              <h3 className="mb-2 text-3xl font-bold text-slate-950">Olá, {firstName || 'Usuário'}!</h3>
              <h1 className="text-2xl font-bold text-gray-800"></h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
              <ActionCard 
                title="Demandas da Imprensa" 
                icon={<ClipboardList className="h-12 w-12 text-[#f57c35]" />} 
                onClick={() => window.location.href = '/demandas'} 
                color="blue" 
              />
              
              <ActionCard 
                title="Notas Oficiais" 
                icon={<FileCheck className="h-12 w-12 text-[#f57c35]" />} 
                onClick={() => window.location.href = '/notas-oficiais'} 
                color="green" 
              />
              
              <ActionCard 
                title="Relatórios" 
                icon={<BarChart2 className="h-12 w-12 text-[#f57c35]" />} 
                onClick={() => window.location.href = '/relatorios'} 
                color="orange" 
              />
              
              <ActionCard 
                title="Usuários" 
                icon={<Users className="h-12 w-12 text-[#f57c35]" />} 
                onClick={() => window.location.href = '/usuarios'} 
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
