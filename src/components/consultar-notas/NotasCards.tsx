
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText } from 'lucide-react';
import { NotaOficial } from './NotasTable';

interface NotasCardsProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
}

const NotasCards: React.FC<NotasCardsProps> = ({ notas, loading, formatDate }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Nenhuma nota encontrada.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Aprovado</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
      case 'rascunho':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Rascunho</Badge>;
      case 'publicado':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Publicado</Badge>;
      case 'rejeitado':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {notas.map((nota) => (
        <Card key={nota.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-[#174ba9] text-lg line-clamp-2">{nota.titulo}</h3>
              {getStatusBadge(nota.status)}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                <span>{nota.areas_coordenacao?.nome || 'Área não informada'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span>{formatDate(nota.criado_em)}</span>
              </div>
            </div>
            
            {nota.texto && (
              <div className="text-sm text-gray-700 line-clamp-3 pt-3 border-t border-gray-100">
                {nota.texto}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotasCards;
