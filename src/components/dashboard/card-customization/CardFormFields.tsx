
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dashboardPages } from './utils';
import ColorOptions from './ColorOptions';
import IconSelector from './IconSelector';
import DimensionOptions from './DimensionOptions';

interface CardFormFieldsProps {
  form: UseFormReturn<FormSchema>;
  selectedIconId: string;
  setSelectedIconId: (id: string) => void;
}

const CardFormFields: React.FC<CardFormFieldsProps> = ({ 
  form, 
  selectedIconId,
  setSelectedIconId 
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="Digite o título do card" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="path"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link de Redirecionamento</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma página" />
                </SelectTrigger>
                <SelectContent>
                  {dashboardPages.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <ColorOptions 
                  selectedColor={field.value} 
                  onSelectColor={(color) => form.setValue('color', color as any)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DimensionOptions form={form} />
      </div>
      
      <FormField
        control={form.control}
        name="iconId"
        render={() => (
          <FormItem>
            <FormLabel>Ícone</FormLabel>
            <FormControl>
              <IconSelector 
                selectedIconId={selectedIconId}
                onSelectIcon={(id) => {
                  setSelectedIconId(id);
                  form.setValue('iconId', id);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CardFormFields;
