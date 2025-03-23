
import React from 'react';
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  BarChart2, 
  PlusCircle, 
  Search,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Settings,
  Home
} from 'lucide-react';

interface IconSelectorProps {
  selectedIconId: string;
  onSelectIcon: (id: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIconId, onSelectIcon }) => {
  const icons = [
    { id: 'clipboard-list', component: <ClipboardList className="h-10 w-10" /> },
    { id: 'message-square-reply', component: <MessageSquareReply className="h-10 w-10" /> },
    { id: 'file-check', component: <FileCheck className="h-10 w-10" /> },
    { id: 'bar-chart-2', component: <BarChart2 className="h-10 w-10" /> },
    { id: 'plus-circle', component: <PlusCircle className="h-10 w-10" /> },
    { id: 'search', component: <Search className="h-10 w-10" /> },
    { id: 'clock', component: <Clock className="h-10 w-10" /> },
    { id: 'alert-triangle', component: <AlertTriangle className="h-10 w-10" /> },
    { id: 'file-text', component: <FileText className="h-10 w-10" /> },
    { id: 'users', component: <Users className="h-10 w-10" /> },
    { id: 'settings', component: <Settings className="h-10 w-10" /> },
    { id: 'home', component: <Home className="h-10 w-10" /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 h-full overflow-y-auto p-1">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all
            ${selectedIconId === icon.id 
              ? 'bg-blue-100 ring-2 ring-blue-500' 
              : 'hover:bg-gray-100'
            }`}
          onClick={() => onSelectIcon(icon.id)}
        >
          {icon.component}
        </div>
      ))}
    </div>
  );
};

export default IconSelector;
