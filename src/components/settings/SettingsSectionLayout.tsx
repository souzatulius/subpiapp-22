
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsSectionLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  color?: string;
}

const SettingsSectionLayout: React.FC<SettingsSectionLayoutProps> = ({
  title,
  description,
  children,
  icon,
  action,
  color = 'bg-blue-600'
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/settings');
  };
  
  return (
    <div className="space-y-6">
      <div className={`p-4 ${color} text-white rounded-xl shadow-md`}>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {icon && <div className="text-white">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-white/80 mt-1">{description}</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSectionLayout;
