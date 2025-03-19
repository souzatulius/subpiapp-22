
import { useAnnouncementsData } from './useAnnouncementsData';
import { useNotifications } from './useNotifications';

export const useAnnouncements = () => {
  const announcementsData = useAnnouncementsData();
  const notificationsData = useNotifications();

  return {
    ...announcementsData,
    ...notificationsData
  };
};
