
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { Logo } from '../../shared/Logo';
import { NotificationsPopover } from './NotificationsPopover';
import MobileMenu from './MobileMenu';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';

interface HeaderProps {
  hideSearch?: boolean;
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ hideSearch = false, showControls = true, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset search value when route changes
  useEffect(() => {
    setSearchValue('');
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the current path
    const currentPath = location.pathname;

    // Check if we're already on a search page
    if (currentPath.includes('/dashboard')) {
      // Navigate to search with the updated query
      navigate(`/dashboard?q=${searchValue}`);
    } else {
      // Navigate to dashboard search
      navigate(`/dashboard?q=${searchValue}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="text-lg font-bold ml-2 text-[#003570]">SubPI</span>
            </Link>
          </div>

          {!hideSearch && (
            <div className="hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar demandas, notas..."
                  className="bg-zinc-100 w-96 px-4 py-2 rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {showControls && <NotificationsPopover />}
            {showControls && <ProfileMenu />}
            {showControls && (
              <button
                className="md:hidden text-[#003570]"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  if (toggleSidebar) toggleSidebar();
                }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile search (only shown if search is enabled) */}
        {!hideSearch && (
          <div className="mt-4 lg:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar demandas, notas..."
                className="bg-zinc-100 w-full px-4 py-2 rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        )}
        
        {/* Notifications Enabler */}
        <div className="mt-2">
          <NotificationsEnabler />
        </div>
      </div>

      {/* Mobile menu */}
      {showControls && <MobileMenu isOpen={isMobileMenuOpen} />}
    </header>
  );
};

export default Header;
