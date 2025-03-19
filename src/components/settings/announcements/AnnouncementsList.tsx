
import React from 'react';
import AnnouncementCard from './AnnouncementCard';

interface AnnouncementsListProps {
  loading: boolean;
  filter: string;
  filteredAnnouncements: any[];
  setCurrentAnnouncement: (announcement: any) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  loading,
  filter,
  filteredAnnouncements,
  setCurrentAnnouncement,
  setIsDeleteDialogOpen,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
        <p className="ml-2">Carregando comunicados...</p>
      </div>
    );
  }

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">
          {filter ? 'Nenhum comunicado encontrado para a busca' : 'Nenhum comunicado cadastrado'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAnnouncements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          onDelete={(announcement) => {
            setCurrentAnnouncement(announcement);
            setIsDeleteDialogOpen(true);
          }}
        />
      ))}
    </div>
  );
};

export default AnnouncementsList;
