
import React from 'react';
import { PlusCircle, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ActionCardsProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

const ActionCards: React.FC<ActionCardsProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = 'dashboard/comunicacao'
}) => {
  const cards = [
    {
      title: 'Cadastrar Demanda',
      description: 'Registre novas solicitações da imprensa',
      icon: <PlusCircle className="h-4 w-4 text-blue-500" />,
      iconBg: 'bg-blue-50',
      link: `/${baseUrl}/cadastrar`
    },
    {
      title: 'Responder Demanda',
      description: 'Responda às demandas pendentes',
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      iconBg: 'bg-green-50',
      link: `/${baseUrl}/responder`
    },
    {
      title: 'Criar Nota Oficial',
      description: 'Elabore notas oficiais',
      icon: <FileText className="h-4 w-4 text-orange-500" />,
      iconBg: 'bg-orange-50',
      link: `/${baseUrl}/criar-nota`
    },
    {
      title: 'Aprovar Notas',
      description: 'Revise e aprove notas oficiais',
      icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
      iconBg: 'bg-purple-50',
      link: `/${baseUrl}/aprovar-nota`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Link key={index} to={card.link} className="block h-full">
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
      ))}
    </div>
  );
};

export default ActionCards;
