
import { useState, useEffect } from 'react';
import { ClipboardList, MessageSquareReply, FileCheck, BarChart2, PlusCircleIcon, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ActionCardItem } from '@/components/dashboard/CardGrid';
import { useNavigate } from 'react-router-dom';

// Define interface for our user_dashboard table
interface UserDashboard {
  id: string;
  user_id: string;
  cards_config: string; // JSON stored as string
  created_at: string;
  updated_at: string;
}

export const useDashboardState = (userId?: string) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default cards configuration
  const defaultCards: ActionCardItem[] = [
    {
      id: 'quick-demand',
      title: 'Iniciar nova demanda',
      icon: <PlusCircleIcon className="h-12 w-12" />,
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue-dark',
      width: '50',
      height: '2',
      isCustom: false,
      isQuickDemand: true,
    },
    {
      id: 'smart-search',
      title: 'O que você deseja fazer?',
      icon: <Search className="h-12 w-12" />,
      path: '',
      color: 'gray-light',
      width: '100',
      height: '1',
      isCustom: false,
      isSearch: true,
    },
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
  ];

  const [actionCards, setActionCards] = useState<ActionCardItem[]>(defaultCards);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);

  // Load user name and saved cards
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          // Fetch user name
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('nome_completo')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;

          // Get the first name only
          const fullName = userData?.nome_completo || '';
          const firstNameOnly = fullName.split(' ')[0];
          setFirstName(firstNameOnly);

          // Fetch saved dashboard configuration
          const { data: dashboardData, error: dashboardError } = await supabase
            .from<UserDashboard>('user_dashboard')
            .select('cards_config')
            .eq('user_id', userId)
            .maybeSingle();

          if (dashboardError && dashboardError.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" error, which is expected for first-time users
            console.error('Error fetching dashboard data:', dashboardError);
          }

          // If user has saved configuration, use it; otherwise use default
          if (dashboardData?.cards_config) {
            try {
              const savedCards = JSON.parse(dashboardData.cards_config);
              
              // Transform string icon references back into React components
              const processedCards = savedCards.map((card: any) => {
                // Process icon based on string reference
                let iconComponent;
                switch (card.iconId) {
                  case 'clipboard-list':
                    iconComponent = <ClipboardList className="h-12 w-12" />;
                    break;
                  case 'message-square-reply':
                    iconComponent = <MessageSquareReply className="h-12 w-12" />;
                    break;
                  case 'file-check':
                    iconComponent = <FileCheck className="h-12 w-12" />;
                    break;
                  case 'bar-chart-2':
                    iconComponent = <BarChart2 className="h-12 w-12" />;
                    break;
                  case 'plus-circle':
                    iconComponent = <PlusCircleIcon className="h-12 w-12" />;
                    break;
                  case 'search':
                    iconComponent = <Search className="h-12 w-12" />;
                    break;
                  default:
                    iconComponent = <ClipboardList className="h-12 w-12" />;
                }
                
                return {
                  ...card,
                  icon: iconComponent
                };
              });
              
              setActionCards(processedCards);
            } catch (error) {
              console.error('Error parsing saved dashboard config:', error);
              setActionCards(defaultCards);
            }
          }
        } catch (error) {
          console.error('Error in fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, [userId]);

  // Save cards configuration whenever it changes
  useEffect(() => {
    if (userId && actionCards.length > 0) {
      const saveConfiguration = async () => {
        try {
          // Transform React components to string references for storage
          const serializableCards = actionCards.map(card => {
            let iconId = 'clipboard-list'; // Default
            
            // Determine icon type (simplified for example)
            if (card.title.includes('Demanda') || card.isQuickDemand) {
              iconId = card.isQuickDemand ? 'plus-circle' : 'clipboard-list';
            } else if (card.title.includes('Responder')) {
              iconId = 'message-square-reply';
            } else if (card.title.includes('Aprovar') || card.title.includes('Nota')) {
              iconId = 'file-check';
            } else if (card.title.includes('Números') || card.title.includes('Comunicação')) {
              iconId = 'bar-chart-2';
            } else if (card.isSearch) {
              iconId = 'search';
            }
            
            // Return a serializable version of the card
            return {
              ...card,
              icon: undefined, // Remove React component
              iconId: iconId // Store string reference instead
            };
          });
          
          // Convert to JSON string to store in the database
          const cardsConfigString = JSON.stringify(serializableCards);
          
          // Upsert the configuration using explicit types
          const { error } = await supabase
            .from<UserDashboard>('user_dashboard')
            .upsert({ 
              user_id: userId, 
              cards_config: cardsConfigString 
            }, 
            { 
              onConflict: 'user_id'
            });
            
          if (error) throw error;
          
        } catch (error) {
          console.error('Error saving dashboard configuration:', error);
        }
      };
      
      // Debounce to avoid too many save operations
      const timeoutId = setTimeout(saveConfiguration, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [actionCards, userId]);

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

  const handleQuickDemandSubmit = () => {
    if (newDemandTitle.trim()) {
      // Store the title in localStorage to retrieve it in the cadastrar page
      localStorage.setItem('quick_demand_title', newDemandTitle);
      // Navigate to the cadastrar page
      navigate('/dashboard/comunicacao/cadastrar');
      
      // Reset the field
      setNewDemandTitle('');
    }
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    
    // Simple implementation: search for cards matching the query
    if (query.toLowerCase().includes('demanda')) {
      navigate('/dashboard/comunicacao/cadastrar');
    } else if (query.toLowerCase().includes('responder')) {
      navigate('/dashboard/comunicacao/responder');
    } else if (query.toLowerCase().includes('nota') || query.toLowerCase().includes('aprovar')) {
      navigate('/dashboard/comunicacao/aprovar-nota');
    } else if (query.toLowerCase().includes('relatorio') || query.toLowerCase().includes('número')) {
      navigate('/dashboard/comunicacao/relatorios');
    } else {
      // Show toast with "no results found"
      toast({
        title: "Busca",
        description: `Nenhum resultado encontrado para '${query}'`,
        variant: "default",
      });
    }
  };

  return {
    firstName,
    actionCards,
    setActionCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    // Quick demand functionality
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    // Search functionality
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  };
};

