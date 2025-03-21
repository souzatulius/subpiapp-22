
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import { ClipboardList, MessageSquareReply, FileCheck, BarChart2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';
import { Button } from '@/components/ui/button';

// Define action card data type
interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

// Create sortable version of ActionCard
const SortableActionCard = ({ card }: { card: ActionCardItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ActionCard
        id={card.id}
        title={card.title}
        icon={card.icon}
        path={card.path}
        color={card.color}
        isDraggable={true}
      />
    </div>
  );
};

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([
    {
      id: '1',
      title: 'Nova Demanda',
      icon: <ClipboardList className="h-12 w-12" />,
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue'
    },
    {
      id: '2',
      title: 'Responder Demandas',
      icon: <MessageSquareReply className="h-12 w-12" />,
      path: '/dashboard/comunicacao/responder',
      color: 'green'
    },
    {
      id: '3',
      title: 'Aprovar Nota',
      icon: <FileCheck className="h-12 w-12" />,
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange'
    },
    {
      id: '4',
      title: 'Números da Comunicação',
      icon: <BarChart2 className="h-12 w-12" />,
      path: '/dashboard/comunicacao/relatorios',
      color: 'purple'
    }
  ]);

  const { user } = useAuth();
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setActionCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      toast({
        title: "Cards reorganizados",
        description: "A nova ordem dos cards foi salva com sucesso.",
        variant: "success",
      });
    }
  };

  const handleDeleteCard = (id: string) => {
    setActionCards((cards) => cards.filter((card) => card.id !== id));
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
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={actionCards.map(card => card.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {actionCards.map((card) => (
                    <SortableActionCard key={card.id} card={card} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
