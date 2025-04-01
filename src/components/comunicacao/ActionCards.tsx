
import React, { useState } from 'react';
import { PlusCircle, MessageSquare, FileText, CheckCircle, Eye, EyeOff, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ActionCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  iconBg: string;
  link: string;
  isHidden?: boolean;
}

const ActionCards: React.FC<ActionCardProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = ''
}) => {
  // Initialize cards with isHidden property
  const [cards, setCards] = useState<CardItem[]>([
    {
      id: 'cadastrar',
      title: 'Cadastrar Demanda',
      description: 'Registre novas solicitações da imprensa',
      icon: <PlusCircle className="h-4 w-4 text-blue-500" />,
      iconBg: 'bg-blue-50',
      link: `${baseUrl ? `/${baseUrl}` : ''}/cadastrar`,
      isHidden: false
    },
    {
      id: 'responder',
      title: 'Responder Demanda',
      description: 'Responda às demandas pendentes',
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      iconBg: 'bg-green-50',
      link: `${baseUrl ? `/${baseUrl}` : ''}/responder`,
      isHidden: false
    },
    {
      id: 'criar-nota',
      title: 'Criar Nota Oficial',
      description: 'Elabore notas oficiais',
      icon: <FileText className="h-4 w-4 text-orange-500" />,
      iconBg: 'bg-orange-50',
      link: `${baseUrl ? `/${baseUrl}` : ''}/criar-nota`,
      isHidden: false
    },
    {
      id: 'aprovar-nota',
      title: 'Aprovar Notas',
      description: 'Revise e aprove notas oficiais',
      icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
      iconBg: 'bg-purple-50',
      link: `${baseUrl ? `/${baseUrl}` : ''}/aprovar-nota`,
      isHidden: false
    }
  ]);

  const [isEditMode, setIsEditMode] = useState(false);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Toggle card visibility
  const toggleCardVisibility = (id: string) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isHidden: !card.isHidden } : card
      )
    );

    toast({
      title: "Card atualizado",
      description: "A visibilidade do card foi alterada",
      variant: "success"
    });
  };

  // Edit card (placeholder for future implementation)
  const editCard = (id: string) => {
    toast({
      title: "Edição de card",
      description: "A funcionalidade de edição será implementada em breve",
      variant: "info"
    });
  };

  // Filter visible cards
  const visibleCards = cards.filter(card => !card.isHidden);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {isEditMode && (
          <h3 className="text-sm font-medium text-blue-600">
            Modo de edição ativo
          </h3>
        )}
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={toggleEditMode}
        >
          {isEditMode ? "Concluir edição" : "Editar cards"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isEditMode ? (
          // Show all cards in edit mode
          cards.map((card) => (
            <div key={card.id} className={`relative ${card.isHidden ? 'opacity-50' : ''}`}>
              <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <div className={`p-2 rounded-full ${card.iconBg}`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-medium text-gray-900">{card.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-white shadow-sm hover:bg-gray-100"
                  onClick={() => toggleCardVisibility(card.id)}
                >
                  {card.isHidden ? 
                    <Eye className="h-4 w-4 text-blue-600" /> : 
                    <EyeOff className="h-4 w-4 text-orange-600" />
                  }
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-white shadow-sm hover:bg-gray-100"
                  onClick={() => editCard(card.id)}
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Show only visible cards in normal mode
          visibleCards.map((card) => (
            <Link key={card.id} to={card.link} className="block h-full">
              <Card className="shadow-sm hover:shadow-md transition-shadow h-full hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <div className={`p-2 rounded-full ${card.iconBg}`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-medium text-gray-900">{card.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionCards;
