
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AccountSettingsModal from '@/components/profile/AccountSettingsModal';

interface UserProfileCardProps {
  id: string;
  title: string;
  className?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  id,
  title,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div 
        className="h-full cursor-pointer" 
        onClick={() => setIsOpen(true)}
      >
        <Card className="h-full flex flex-col items-center justify-center p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all bg-gray-50 px-[10px] py-[20px]">
          <User className="h-12 w-12 text-blue-700 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-sm mt-2 text-center font-normal text-gray-600">Clique para editar seu perfil</p>
        </Card>
      </div>
      
      <AccountSettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTab="profile"
      />
    </>
  );
};

export default UserProfileCard;
