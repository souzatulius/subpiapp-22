
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { widthOptions, heightOptions } from './utils';

interface DimensionOptionsProps {
  form: UseFormReturn<FormSchema>;
}

const DimensionOptions: React.FC<DimensionOptionsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField form={form} name="width" />
      <FormField form={form} name="height" />
    </div>
  );
};

interface FormFieldProps {
  form: UseFormReturn<FormSchema>;
  name: "width" | "height";
}

const FormField: React.FC<FormFieldProps> = ({ form, name }) => {
  const options = name === "width" ? widthOptions : heightOptions;
  const label = name === "width" ? "Largura" : "Altura";
  
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={(value) => form.setValue(name, value as any)}
          defaultValue={form.watch(name)}
          className="grid grid-cols-2 gap-2"
        >
          {options.map((option) => (
            <div key={option.id}>
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${name}-${option.id}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-2 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-subpi-blue peer-data-[state=checked]:text-subpi-blue"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default DimensionOptions;
