
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotaOficial } from '@/types/nota';
import { Skeleton } from '@/components/ui/skeleton';

interface NotasCardsProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onView: (nota: NotaOficial) => void;
  onEdit: (id: string) => void;
  onDelete: (nota: NotaOficial) => void;
}

const NotasCards: React.FC<NotasCardsProps> = ({ notas, loading, formatDate, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Skeleton className="h-8 w-20" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Nenhuma nota encontrada.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notas.map((nota) => (
        <Card key={nota.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg line-clamp-2">{nota.titulo}</CardTitle>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span>Criado em: {formatDate(nota.criado_em || nota.created_at || '')}</span>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-gray-700 line-clamp-3">{nota.conteudo}</p>
            <div className="mt-2">
              <Badge className={`
                ${nota.status === 'rascunho' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                  nota.status === 'aprovada' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                  nota.status === 'pendente' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                  'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              `}>
                {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <div className="text-sm text-gray-500">
              {nota.area_coordenacao?.descricao || 'Sem área definida'}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" onClick={() => onView(nota)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onEdit(nota.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(nota)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NotasCards;
