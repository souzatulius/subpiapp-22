
import React from 'react';
import { Check } from 'lucide-react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { colorOptions } from './utils';

interface ColorOptionsProps {
  form: UseFormReturn<FormSchema>;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ form }) => {
  return (
    <FormItem>
      <FormLabel>Cor</FormLabel>
      <div className="grid grid-cols-4 gap-2">
        {colorOptions.map((color) => (
          <div
            key={color.id}
            className={`cursor-pointer p-2 rounded-md border-2 ${
              form.watch('color') === color.value
                ? 'border-gray-900 shadow-md'
                : 'border-transparent'
            }`}
            onClick={() => form.setValue('color', color.value as any)}
          >
            <div
              className={`w-full h-8 ${color.bgClass} rounded-md flex items-center justify-center`}
            >
              {form.watch('color') === color.value && (
                <Check className="h-4 w-4 text-gray-600" />
              )}
            </div>
          </div>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default ColorOptions;
