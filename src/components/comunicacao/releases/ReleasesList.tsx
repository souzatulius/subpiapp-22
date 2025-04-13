
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Release } from '@/types/comunicacao';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReleasesListProps {
  releases: Release[];
  isLoading: boolean;
  onSelectRelease: (release: Release) => void;
}

const ReleasesList: React.FC<ReleasesListProps> = ({ releases, isLoading, onSelectRelease }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-gray-200 rounded-xl">
            <CardContent className="p-5">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <Card className="border-gray-200 rounded-xl">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Nenhum release encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {releases.map((release) => (
        <Card 
          key={release.id} 
          className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer rounded-xl"
          onClick={() => onSelectRelease(release)}
        >
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-1.5 line-clamp-2 text-gray-800">
              {release.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {release.summary}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>
                  {new Date(release.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{release.author}</span>
              </div>
              {release.status === 'publicado' ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">
                  Publicado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full">
                  Rascunho
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReleasesList;
