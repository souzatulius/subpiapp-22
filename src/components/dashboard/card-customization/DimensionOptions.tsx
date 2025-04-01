
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { widthOptions, heightOptions } from './utils';
import { Label } from '@/components/ui/label';

interface DimensionOptionsProps {
  form: UseFormReturn<FormSchema>;
}

const DimensionOptions: React.FC<DimensionOptionsProps> = ({ form }) => {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="width"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Largura</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-2"
              >
                {widthOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-1">
                    <RadioGroupItem value={option.value} id={`width-${option.id}`} />
                    <Label htmlFor={`width-${option.id}`} className="text-sm cursor-pointer">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Altura</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                {heightOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-1">
                    <RadioGroupItem value={option.value} id={`height-${option.id}`} />
                    <Label htmlFor={`height-${option.id}`} className="text-sm cursor-pointer">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DimensionOptions;
