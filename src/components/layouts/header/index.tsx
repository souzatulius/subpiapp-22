import React, { useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import ProfileMenu from './ProfileMenu';
import NotificationsPopover from './NotificationsPopover';
import { useNotifications } from './useNotifications';
interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}
const Header: React.FC<HeaderProps> = ({
  showControls = false,
  toggleSidebar
}) => {
  const {
    user
  } = useAuth();
  const {
    fetchNotifications,
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead
  } = useNotifications();

  // Fetch notifications when component mounts or when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  return <header className="bg-white border-b border-gray-200 z-30 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showControls && toggleSidebar && <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </button>}
            
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img alt="SUBPI" src="/lovable-uploads/6f22cfe3-91db-4e42-87c1-213c33775b2a.png" className="h-10 w-auto" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user && <>
                <NotificationsPopover notifications={notifications} unreadCount={unreadCount} onMarkAsRead={markAsRead} onDeleteNotification={deleteNotification} onMarkAllAsRead={markAllAsRead} onRefresh={fetchNotifications} />
                <ProfileMenu />
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;