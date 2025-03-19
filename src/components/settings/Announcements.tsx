
import React from 'react';
import AnnouncementsHeader from './announcements/AnnouncementsHeader';
import AnnouncementCard from './announcements/AnnouncementCard';
import CreateAnnouncementDialog from './announcements/CreateAnnouncementDialog';
import DeleteAnnouncementDialog from './announcements/DeleteAnnouncementDialog';
import { useAnnouncements } from './announcements/useAnnouncements';

const Announcements = () => {
  const {
    loading,
    filter,
    setFilter,
    filteredAnnouncements,
    isSubmitting,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentAnnouncement,
    setCurrentAnnouncement,
    form,
    handleCreateAnnouncement,
    handleDeleteAnnouncement,
    handleExportCsv,
    handlePrint,
  } = useAnnouncements();

  return (
    <div className="space-y-6">
      <AnnouncementsHeader
        filter={filter}
        setFilter={setFilter}
        handleExportCsv={handleExportCsv}
        handlePrint={handlePrint}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="ml-2">Carregando comunicados...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">
            {filter ? 'Nenhum comunicado encontrado para a busca' : 'Nenhum comunicado cadastrado'}
          </p>
        </div>
      ) : (
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
      )}
      
      <CreateAnnouncementDialog
        open={isCreateDialogOpen}
        setOpen={setIsCreateDialogOpen}
        form={form}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateAnnouncement}
      />
      
      <DeleteAnnouncementDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        announcement={currentAnnouncement}
        onDelete={handleDeleteAnnouncement}
      />
    </div>
  );
};

export default Announcements;
