
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, description }) => {
  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <div className="p-1 bg-blue-100 rounded">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      <Separator className="mb-6" />
    </>
  );
};
