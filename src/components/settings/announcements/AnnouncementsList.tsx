
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Announcement } from './types';

interface AnnouncementsListProps {
  loading: boolean;
  filter: string;
  filteredAnnouncements: Announcement[];
  setCurrentAnnouncement: (announcement: Announcement) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  formatDestination: (destinatarios: string) => string;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  loading,
  filter,
  filteredAnnouncements,
  setCurrentAnnouncement,
  setIsDeleteDialogOpen,
  formatDestination,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-md p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        {filter ? (
          <p className="text-muted-foreground">Nenhum comunicado encontrado para "{filter}".</p>
        ) : (
          <p className="text-muted-foreground">Nenhum comunicado disponível no momento.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAnnouncements.map((announcement) => (
        <div key={announcement.id} className="border rounded-md p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{announcement.titulo}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => {
                setCurrentAnnouncement(announcement);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm mt-2 whitespace-pre-wrap line-clamp-3">{announcement.mensagem}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {formatDestination(announcement.destinatarios)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <div>
              <span>Por: </span>
              <span className="font-medium">{announcement.autor?.nome_completo || 'Usuário Desconhecido'}</span>
            </div>
            <time dateTime={announcement.data_envio}>
              {formatDistanceToNow(new Date(announcement.data_envio), { addSuffix: true, locale: ptBR })}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsList;
