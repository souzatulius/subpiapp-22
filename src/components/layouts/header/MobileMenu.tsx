
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, BarChart2, Settings, Users } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="block lg:hidden bg-white border-t border-gray-200">
      <div className="container mx-auto">
        <nav className="py-4">
          <ul className="space-y-3">
            <li>
              <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                <Home className="h-5 w-5 mr-3 text-blue-600" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/comunicacao/comunicacao" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                <FileText className="h-5 w-5 mr-3 text-blue-600" />
                <span>Comunicação</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/zeladoria/ranking-subs" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                <BarChart2 className="h-5 w-5 mr-3 text-blue-600" />
                <span>Zeladoria</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                <Settings className="h-5 w-5 mr-3 text-blue-600" />
                <span>Configurações</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users-permissions" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <span>Administração</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
