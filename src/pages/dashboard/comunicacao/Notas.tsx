
import React, { useState } from 'react';
import ActionCard from '@/components/dashboard/ActionCard';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  FileCheck, 
  Search, 
  BookOpen,
  TrendingUp, 
  TrendingDown,
  BarChart2,
  Pencil
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';

interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
}

const NotasDashboard: React.FC = () => {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([
    {
      id: 'nova-nota',
      title: 'Nova Nota',
      icon: <FileText className="h-12 w-12" />,
      path: '/dashboard/comunicacao/criar-nota',
      color: 'blue',
    },
    {
      id: 'aprovar-nota',
      title: 'Aprovar Nota',
      icon: <FileCheck className="h-12 w-12" />,
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'green',
    },
    {
      id: 'consultar-notas',
      title: 'Consultar Notas',
      icon: <BookOpen className="h-12 w-12" />,
      path: '/dashboard/comunicacao/consultar-notas',
      color: 'orange',
    },
    {
      id: 'relatorios-notas',
      title: 'Relatórios',
      icon: <BarChart2 className="h-12 w-12" />,
      path: '/dashboard/comunicacao/relatorios',
      color: 'purple',
    }
  ]);

  // Dados estatísticos das notas (simulados)
  const notasStats = [
    {
      title: 'Total de Notas',
      value: '1',
      change: '+12%',
      trend: 'up',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Aguardando Aprovação',
      value: '1',
      change: '+4%',
      trend: 'up',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Notas Recusadas',
      value: '5',
      change: '-15%',
      trend: 'down',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Taxa de Aprovação',
      value: '100%',
      change: '+5%',
      trend: 'up',
      description: 'em relação ao mês passado'
    }
  ];

  // Função para remover um card do dashboard
  const handleDeleteCard = (id: string) => {
    setActionCards(cards => cards.filter(card => card.id !== id));
    toast({
      title: "Card removido",
      description: "O card foi removido com sucesso.",
      variant: "success",
    });
  };

  // Função para editar um card
  const handleEditCard = (id: string) => {
    const cardToEdit = actionCards.find(card => card.id === id);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsCustomizationModalOpen(true);
    }
  };

  // Função para salvar alterações em um card
  const handleSaveCard = (cardData: Omit<ActionCardItem, 'id'>) => {
    if (editingCard) {
      // Edit existing card
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notas para Imprensa</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {actionCards.map((card) => (
          <ActionCard 
            key={card.id}
            id={card.id}
            title={card.title} 
            icon={card.icon} 
            path={card.path} 
            color={card.color}
            onDelete={handleDeleteCard}
            onEdit={handleEditCard}
            width={card.width}
            height={card.height}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {notasStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
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

export default NotasDashboard;
