
import React from 'react';
import AnnouncementsHeader from './announcements/AnnouncementsHeader';
import AnnouncementsList from './announcements/AnnouncementsList';
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
      
      <AnnouncementsList
        loading={loading}
        filter={filter}
        filteredAnnouncements={filteredAnnouncements}
        setCurrentAnnouncement={setCurrentAnnouncement}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />
      
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
