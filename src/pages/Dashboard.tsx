
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import { ClipboardList, MessageSquareReply, FileCheck, BarChart2, PlusCircle, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';
import { Button } from '@/components/ui/button';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';

// Define action card data type
interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
  isCustom?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
}

// Create sortable version of ActionCard
const SortableActionCard = ({ 
  card, 
  onEdit, 
  onDelete 
}: { 
  card: ActionCardItem, 
  onEdit?: (card: ActionCardItem) => void, 
  onDelete?: (id: string) => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(card);
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`${card.width ? getWidthClasses(card.width) : 'col-span-1'} ${card.height === '2' ? 'row-span-2' : ''}`}
    >
      <ActionCard
        id={card.id}
        title={card.title}
        icon={card.icon}
        path={card.path}
        color={card.color}
        isDraggable={true}
        onDelete={onDelete}
        onEdit={handleEdit}
        width={card.width}
        height={card.height}
        isCustom={card.isCustom}
      />
    </div>
  );
};

// Function to get width classes
const getWidthClasses = (width: string = '25') => {
  switch (width) {
    case '25':
      return 'col-span-1';
    case '50':
      return 'col-span-1 md:col-span-2';
    case '75':
      return 'col-span-1 md:col-span-3';
    case '100':
      return 'col-span-1 md:col-span-4';
    default:
      return 'col-span-1';
  }
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
      color: 'blue',
      width: '25',
      height: '1'
    },
    {
      id: '2',
      title: 'Responder Demandas',
      icon: <MessageSquareReply className="h-12 w-12" />,
      path: '/dashboard/comunicacao/responder',
      color: 'green',
      width: '25',
      height: '1'
    },
    {
      id: '3',
      title: 'Aprovar Nota',
      icon: <FileCheck className="h-12 w-12" />,
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange',
      width: '25',
      height: '1'
    },
    {
      id: '4',
      title: 'Números da Comunicação',
      icon: <BarChart2 className="h-12 w-12" />,
      path: '/dashboard/comunicacao/relatorios',
      color: 'purple',
      width: '25',
      height: '1'
    }
  ]);

  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);

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
    
    toast({
      title: "Card removido",
      description: "O card foi removido com sucesso.",
      variant: "success",
    });
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCustomizationModalOpen(true);
  };

  const handleEditCard = (card: ActionCardItem) => {
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = (cardData: Omit<ActionCardItem, 'id'>) => {
    if (editingCard) {
      // Edit existing card
      setActionCards(cards => 
        cards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...cardData, isCustom: true }
            : card
        )
      );
      
      toast({
        title: "Card atualizado",
        description: "As alterações foram salvas com sucesso.",
        variant: "success",
      });
    } else {
      // Add new card
      const newCard = {
        id: `custom-${Date.now()}`,
        ...cardData,
        isCustom: true
      };
      
      setActionCards(cards => [...cards, newCard]);
      
      toast({
        title: "Novo card adicionado",
        description: "O card foi criado com sucesso.",
        variant: "success",
      });
    }
    
    setIsCustomizationModalOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h3 className="mb-2 text-3xl font-bold text-slate-950">Olá, {firstName || 'Usuário'}!</h3>
              <h1 className="text-2xl font-bold text-gray-800"></h1>
            </div>
            
            <div className="flex justify-end mb-6">
              <Button 
                variant="action" 
                onClick={handleAddNewCard}
                className="rounded-xl"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Novo Card
              </Button>
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={actionCards.map(card => card.id)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
                  {actionCards.map((card) => (
                    <SortableActionCard 
                      key={card.id} 
                      card={card} 
                      onEdit={handleEditCard}
                      onDelete={handleDeleteCard}
                    />
                  ))}
                  
                  {/* Add NotificationsEnabler after the cards */}
                  <NotificationsEnabler />
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
      
      {/* Card Customization Modal */}
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default Dashboard;
