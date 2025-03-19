
import { useAnnouncementsData } from './useAnnouncementsData';
import { useNotifications } from './useNotifications';
import { useAnnouncementForm } from './useAnnouncementForm';
import { handleExportCsv, handlePrint, formatDestination } from './utils';
import { Announcement } from './types';

export const useAnnouncements = () => {
  const announcementsData = useAnnouncementsData();
  const { createNotificationsForRecipients } = useNotifications();
  
  const { 
    isSubmitting,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentAnnouncement,
    setCurrentAnnouncement,
    form,
    handleCreateAnnouncement,
    handleDeleteAnnouncement
  } = useAnnouncementForm(
    announcementsData.fetchAnnouncements,
    createNotificationsForRecipients
  );

  // Export and print functionality
  const exportCsv = () => handleExportCsv(announcementsData.filteredAnnouncements);
  const print = () => handlePrint(announcementsData.filteredAnnouncements);

  return {
    ...announcementsData,
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
    handleExportCsv: exportCsv,
    handlePrint: print,
    formatDestination,
    createNotificationsForRecipients
  };
};

// Re-export necessary types for use in other components
export { AnnouncementFormValues, Announcement } from './types';
