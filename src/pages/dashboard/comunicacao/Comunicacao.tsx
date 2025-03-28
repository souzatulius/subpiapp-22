
import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import SortableActionCard from '@/components/dashboard/SortableActionCard';
import { useComunicacaoStats } from '@/hooks/comunicacao/useComunicacaoStats';

interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light' | 'lime' | 'orange-600';
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
}

const ComunicacaoDashboard: React.FC = () => {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([
    {
      id: 'nova-demanda',
      title: 'Nova Demanda',
      icon: <ClipboardList className="h-12 w-12" />,
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue',
    },
    {
      id: 'responder-demandas',
      title: 'Responder Demandas',
      icon: <MessageSquareReply className="h-12 w-12" />,
      path: '/dashboard/comunicacao/responder',
      color: 'green',
    },
    {
      id: 'criar-nota',
      title: 'Criar Nota Oficial',
      icon: <FileText className="h-12 w-12" />,
      path: '/dashboard/comunicacao/criar-nota',
      color: 'orange',
    },
    {
      id: 'aprovar-notas',
      title: 'Aprovar Notas',
      icon: <FileCheck className="h-12 w-12" />,
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'blue-dark',
    },
    {
      id: 'consultar-demandas',
      title: 'Consultar Demandas',
      icon: <Search className="h-12 w-12" />,
      path: '/dashboard/comunicacao/consultar-demandas',
      color: 'orange-light',
    },
    {
      id: 'consultar-notas',
      title: 'Consultar Notas',
      icon: <Search className="h-12 w-12" />,
      path: '/dashboard/comunicacao/consultar-notas',
      color: 'gray-dark',
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      icon: <BarChart2 className="h-12 w-12" />,
      path: '/dashboard/comunicacao/relatorios',
      color: 'gray-light',
    }
  ]);

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

  const comunicacaoStats = [
    {
      title: 'Demandas Abertas Hoje',
      value: isLoading ? '...' : totalDemandas.toString(),
      change: `${demandasVariacao > 0 ? '+' : ''}${demandasVariacao}%`,
      trend: demandasVariacao >= 0 ? 'up' : 'down',
      description: 'em relação a ontem'
    },
    {
      title: 'Aguardando Respostas',
      value: isLoading ? '...' : aguardandoRespostas.toString(),
      change: `${aguardandoVariacao > 0 ? '+' : ''}${aguardandoVariacao}%`,
      trend: aguardandoVariacao >= 0 ? 'up' : 'down',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Tempo Médio de Resposta',
      value: isLoading ? '...' : `${tempoMedioResposta} horas`,
      change: `${tempoRespostaVariacao > 0 ? '+' : ''}${tempoRespostaVariacao}%`,
      trend: tempoRespostaVariacao >= 0 ? 'up' : 'down',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Taxa de Aprovação',
      value: isLoading ? '...' : `${taxaAprovacao}%`,
      change: `${aprovacaoVariacao > 0 ? '+' : ''}${aprovacaoVariacao}%`,
      trend: aprovacaoVariacao >= 0 ? 'up' : 'down',
      description: 'em relação ao mês passado'
    }
  ];

  const handleDeleteCard = (id: string) => {
    setActionCards(cards => cards.filter(card => card.id !== id));
    toast({
      title: "Card removido",
      description: "O card foi removido com sucesso.",
      variant: "success",
    });
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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Comunicação</h1>
      
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {comunicacaoStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default ComunicacaoDashboard;
