import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  FileText,
  Search,
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Loader2,
  AlertTriangle,
  Filter,
  Check,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import SortableActionCard from '@/components/dashboard/SortableActionCard';
import { useComunicacaoStats } from '@/hooks/comunicacao/useComunicacaoStats';
import { useNotasStats } from '@/hooks/comunicacao/useNotasStats';

interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light' | 'lime' | 'orange-600';
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  visible?: boolean;
  category?: 'acao' | 'estatistica' | 'notificacao';
  value?: string;
  change?: string;
  trend?: 'up' | 'down';
  description?: string;
}

const ALL_CARDS: ActionCardItem[] = [
  {
    id: 'nova-demanda',
    title: 'Nova Demanda',
    icon: <ClipboardList className="h-12 w-12" />,
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue',
    category: 'acao',
    visible: true,
  },
  {
    id: 'responder-demandas',
    title: 'Responder Demandas',
    icon: <MessageSquareReply className="h-12 w-12" />,
    path: '/dashboard/comunicacao/responder',
    color: 'green',
    category: 'acao',
    visible: true,
  },
  {
    id: 'criar-nota',
    title: 'Criar Nota Oficial',
    icon: <FileText className="h-12 w-12" />,
    path: '/dashboard/comunicacao/criar-nota',
    color: 'orange',
    category: 'acao',
    visible: true,
  },
  {
    id: 'aprovar-notas',
    title: 'Aprovar Notas',
    icon: <FileCheck className="h-12 w-12" />,
    path: '/dashboard/comunicacao/aprovar-nota',
    color: 'blue-dark',
    category: 'acao',
    visible: true,
  },
  {
    id: 'consultar-demandas',
    title: 'Consultar Demandas',
    icon: <Search className="h-12 w-12" />,
    path: '/dashboard/comunicacao/consultar-demandas',
    color: 'orange-light',
    category: 'acao',
    visible: true,
  },
  {
    id: 'consultar-notas',
    title: 'Consultar Notas',
    icon: <Search className="h-12 w-12" />,
    path: '/dashboard/comunicacao/consultar-notas',
    color: 'gray-dark',
    category: 'acao',
    visible: true,
  },
  {
    id: 'relatorios',
    title: 'Relatórios',
    icon: <BarChart2 className="h-12 w-12" />,
    path: '/dashboard/comunicacao/relatorios',
    color: 'gray-light',
    category: 'acao',
    visible: true,
  },
  {
    id: 'notas-pendentes',
    title: 'Notas Aguardando Aprovação',
    icon: <AlertTriangle className="h-12 w-12" />,
    path: '/dashboard/comunicacao/aprovar-nota',
    color: 'orange',
    category: 'notificacao',
    visible: true,
  },
  {
    id: 'demandas-urgentes',
    title: 'Demandas Urgentes',
    icon: <Bell className="h-12 w-12" />,
    path: '/dashboard/comunicacao/responder',
    color: 'orange-600',
    category: 'notificacao',
    visible: true,
  }
];

const ComunicacaoDashboard: React.FC = () => {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>(() => {
    const savedCards = localStorage.getItem('comunicacao-dashboard-cards');
    if (savedCards) {
      try {
        return JSON.parse(savedCards);
      } catch (e) {
        console.error('Failed to parse saved cards:', e);
      }
    }
    return ALL_CARDS.filter(card => card.visible !== false);
  });
  
  const [cardFilters, setCardFilters] = useState<Record<string, boolean>>(() => {
    const initialFilters: Record<string, boolean> = {};
    ALL_CARDS.forEach(card => {
      initialFilters[card.id] = actionCards.some(c => c.id === card.id);
    });
    return initialFilters;
  });

  useEffect(() => {
    localStorage.setItem('comunicacao-dashboard-cards', JSON.stringify(actionCards));
  }, [actionCards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setActionCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const { 
    totalDemandas, 
    demandasVariacao, 
    aguardandoRespostas, 
    aguardandoVariacao,
    tempoMedioResposta, 
    tempoRespostaVariacao, 
    taxaAprovacao, 
    aprovacaoVariacao,
    isLoading 
  } = useComunicacaoStats();
  
  const { 
    aguardandoAprovacao, 
    notasRecusadas,
    isLoading: notasLoading 
  } = useNotasStats();

  const getStatCards = (): ActionCardItem[] => [
    {
      id: 'demandas-hoje',
      title: 'Demandas Abertas Hoje',
      icon: demandasVariacao >= 0 ? <TrendingUp className="h-12 w-12" /> : <TrendingDown className="h-12 w-12" />,
      path: '/dashboard/comunicacao/consultar-demandas',
      color: demandasVariacao >= 0 ? 'green' : 'orange',
      value: isLoading ? '...' : totalDemandas.toString(),
      change: `${demandasVariacao > 0 ? '+' : ''}${demandasVariacao}%`,
      trend: demandasVariacao >= 0 ? 'up' : 'down',
      description: 'em relação a ontem',
      category: 'estatistica',
    },
    {
      id: 'aguardando-respostas',
      title: 'Aguardando Respostas',
      icon: aguardandoVariacao >= 0 ? <TrendingUp className="h-12 w-12" /> : <TrendingDown className="h-12 w-12" />,
      path: '/dashboard/comunicacao/responder',
      color: aguardandoVariacao >= 0 ? 'orange' : 'green',
      value: isLoading ? '...' : aguardandoRespostas.toString(),
      change: `${aguardandoVariacao > 0 ? '+' : ''}${aguardandoVariacao}%`,
      trend: aguardandoVariacao >= 0 ? 'up' : 'down',
      description: 'em relação ao mês passado',
      category: 'estatistica',
    },
    {
      id: 'tempo-resposta',
      title: 'Tempo Médio de Resposta',
      icon: tempoRespostaVariacao <= 0 ? <TrendingDown className="h-12 w-12" /> : <TrendingUp className="h-12 w-12" />,
      path: '',
      color: tempoRespostaVariacao <= 0 ? 'green' : 'orange',
      value: isLoading ? '...' : `${tempoMedioResposta} horas`,
      change: `${tempoRespostaVariacao > 0 ? '+' : ''}${tempoRespostaVariacao}%`,
      trend: tempoRespostaVariacao <= 0 ? 'down' : 'up',
      description: 'em relação ao mês passado',
      category: 'estatistica',
    },
    {
      id: 'taxa-aprovacao',
      title: 'Taxa de Aprovação',
      icon: aprovacaoVariacao >= 0 ? <TrendingUp className="h-12 w-12" /> : <TrendingDown className="h-12 w-12" />,
      path: '',
      color: aprovacaoVariacao >= 0 ? 'green' : 'orange',
      value: isLoading ? '...' : `${taxaAprovacao}%`,
      change: `${aprovacaoVariacao > 0 ? '+' : ''}${aprovacaoVariacao}%`,
      trend: aprovacaoVariacao >= 0 ? 'up' : 'down',
      description: 'em relação ao mês passado',
      category: 'estatistica',
    },
    {
      id: 'aguardando-aprovacao',
      title: 'Notas Aguardando Aprovação',
      icon: <AlertTriangle className="h-12 w-12" />,
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange',
      value: notasLoading ? '...' : aguardandoAprovacao.toString(),
      change: '',
      trend: 'up',
      description: 'notas pendentes de aprovação',
      category: 'estatistica',
    },
    {
      id: 'notas-recusadas',
      title: 'Notas Recusadas',
      icon: <TrendingDown className="h-12 w-12" />,
      path: '/dashboard/comunicacao/consultar-notas',
      color: 'orange-600',
      value: notasLoading ? '...' : notasRecusadas.toString(),
      change: '',
      trend: 'down',
      description: 'total de notas recusadas',
      category: 'estatistica',
    }
  ];

  const comunicacaoStats = getStatCards();

  const handleDeleteCard = (id: string) => {
    setActionCards(cards => cards.filter(card => card.id !== id));
    setCardFilters(filters => ({ ...filters, [id]: false }));
  };

  const handleEditCard = (id: string) => {
    const cardToEdit = actionCards.find(card => card.id === id);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsCustomizationModalOpen(true);
    }
  };

  const handleSaveCard = (cardData: Omit<ActionCardItem, 'id'>) => {
    if (editingCard) {
      setActionCards(cards => 
        cards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...cardData }
            : card
        )
      );
      
      toast({
        title: "Card atualizado",
        description: "As alterações foram salvas com sucesso.",
        variant: "success",
      });
    }
    
    setIsCustomizationModalOpen(false);
    setEditingCard(null);
  };
  
  const handleFilterChange = (id: string, checked: boolean) => {
    setCardFilters(prev => ({
      ...prev,
      [id]: checked
    }));
  };
  
  const applyFilters = () => {
    const selectedCardIds = Object.entries(cardFilters)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    const allPossibleCards = [
      ...ALL_CARDS,
      ...comunicacaoStats
    ];
    
    const filteredActionCards = allPossibleCards
      .filter(card => selectedCardIds.includes(card.id))
      .sort((a, b) => {
        const aIndex = actionCards.findIndex(c => c.id === a.id);
        const bIndex = actionCards.findIndex(c => c.id === b.id);
        
        if (aIndex >= 0 && bIndex >= 0) {
          return aIndex - bIndex;
        }
        
        if (aIndex < 0) return 1;
        if (bIndex < 0) return -1;
        
        return 0;
      });
    
    setActionCards(filteredActionCards);
    setIsFilterDialogOpen(false);
    
    toast({
      title: "Filtros aplicados",
      description: "As alterações foram salvas com sucesso.",
      variant: "success",
    });
  };

  const renderStatCard = (stat: ActionCardItem) => (
    <Card key={stat.id} className="min-h-[140px] flex flex-col justify-center h-full w-full">
      <CardContent className="pt-6 h-full">
        <div className="flex flex-col justify-between h-full">
          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-bold">
              {isLoading || notasLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                stat.value
              )}
            </h3>
            {stat.change && (
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span className="text-sm">{stat.change}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comunicação</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsFilterDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Gerenciar Cards
        </Button>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={actionCards.map(card => card.id)}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {actionCards.map((card) => (
              <SortableActionCard 
                key={card.id}
                card={card} 
                onEdit={(c) => handleEditCard(c.id)}
                onDelete={handleDeleteCard}
              >
                {card.category === 'estatistica' && renderStatCard(card)}
              </SortableActionCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
      
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Cards</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Cards de Ação</h3>
              <div className="space-y-2">
                {ALL_CARDS.filter(card => card.category === 'acao').map((card) => (
                  <div key={card.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={card.id} 
                      checked={cardFilters[card.id] !== false}
                      onCheckedChange={(checked) => handleFilterChange(card.id, checked === true)}
                    />
                    <Label htmlFor={card.id} className="cursor-pointer">{card.title}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Cards de Estatísticas</h3>
              <div className="space-y-2">
                {comunicacaoStats.map((stat) => (
                  <div key={stat.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={stat.id} 
                      checked={cardFilters[stat.id] !== false}
                      onCheckedChange={(checked) => handleFilterChange(stat.id, checked === true)}
                    />
                    <Label htmlFor={stat.id} className="cursor-pointer">{stat.title}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Cards de Notificação</h3>
              <div className="space-y-2">
                {ALL_CARDS.filter(card => card.category === 'notificacao').map((card) => (
                  <div key={card.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={card.id} 
                      checked={cardFilters[card.id] !== false}
                      onCheckedChange={(checked) => handleFilterChange(card.id, checked === true)}
                    />
                    <Label htmlFor={card.id} className="cursor-pointer">{card.title}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsFilterDialogOpen(false)} variant="outline">Cancelar</Button>
            <Button onClick={applyFilters} className="ml-2">
              <Check className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComunicacaoDashboard;
