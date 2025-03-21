
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { availableIcons } from './utils';

interface IconSelectorProps {
  form: UseFormReturn<FormSchema>;
  selectedIconId: string;
  setSelectedIconId: (id: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  form, 
  selectedIconId, 
  setSelectedIconId 
}) => {
  return (
    <FormItem>
      <FormLabel>Ícone</FormLabel>
      <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-1">
        {availableIcons.map((icon) => (
          <div
            key={icon.id}
            className={`cursor-pointer p-2 rounded-md border-2 ${
              form.watch('iconId') === icon.id
                ? 'border-gray-900 shadow-md'
                : 'border-transparent'
            }`}
            onClick={() => {
              form.setValue('iconId', icon.id);
              setSelectedIconId(icon.id);
            }}
          >
            <div className="flex items-center justify-center">
              {icon.component}
            </div>
          </div>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default IconSelector;
