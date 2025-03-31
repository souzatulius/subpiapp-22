
import React from 'react';
import { PlusCircle, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-full bg-blue-50">
              <PlusCircle className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-900">Cadastrar Demanda</h2>
              <p className="mt-1 text-sm text-gray-500 mb-3">
                Registre novas solicitações da imprensa
              </p>
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                asChild
              >
                <Link to={`/${baseUrl}/cadastrar`}>
                  Cadastrar
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-full bg-green-50">
              <MessageSquare className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-900">Responder Demanda</h2>
              <p className="mt-1 text-sm text-gray-500 mb-3">
                Responda às demandas pendentes
              </p>
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                asChild
              >
                <Link to={`/${baseUrl}/demandas/pendentes`}>
                  Responder
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-full bg-orange-50">
              <FileText className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-900">Criar Nota Oficial</h2>
              <p className="mt-1 text-sm text-gray-500 mb-3">
                Elabore notas oficiais
              </p>
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                asChild
              >
                <Link to={`/${baseUrl}/notas/criar`}>
                  Criar
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-full bg-purple-50">
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-900">Aprovar Notas</h2>
              <p className="mt-1 text-sm text-gray-500 mb-3">
                Revise e aprove notas oficiais
              </p>
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                asChild
              >
                <Link to={`/${baseUrl}/notas/aprovar`}>
                  Aprovar
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionCards;
