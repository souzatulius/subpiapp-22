
import React from 'react';
import { Button } from '@/components/ui/button';

type SettingsOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface SettingsMenuProps {
  isOpen: boolean;
  selectedOption: string;
  onOptionSelect: (optionId: string) => void;
}

const settingsOptions: SettingsOption[] = [
  { id: 'profile', label: 'Perfil' },
  { id: 'notifications', label: 'Notificações' },
  { id: 'roles', label: 'Permissões' },
  { id: 'team', label: 'Equipe' }
];

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  selectedOption,
  onOptionSelect,
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="w-64 bg-white border-r h-full p-4">
      <h3 className="font-medium text-lg mb-4">Configurações</h3>
      <div className="space-y-1">
        {settingsOptions.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onOptionSelect(option.id)}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SettingsMenu;
