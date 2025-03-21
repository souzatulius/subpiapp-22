
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormSchema, CardCustomizationModalProps, formSchema } from './card-customization/types';
import { dashboardPages, identifyIconComponent, getIconComponentById } from './card-customization/utils';
import ColorOptions from './card-customization/ColorOptions';
import IconSelector from './card-customization/IconSelector';
import CardFormPreview from './card-customization/CardFormPreview';
import DimensionOptions from './card-customization/DimensionOptions';

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [selectedIconId, setSelectedIconId] = useState<string>('clipboard');
  
  // Set up form with validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      path: '',
      color: 'blue',
      iconId: 'clipboard',
      width: '25',
      height: '1',
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Find the icon ID based on the component type - now using our safer method
      const iconId = identifyIconComponent(initialData.icon);
      
      form.reset({
        title: initialData.title,
        path: initialData.path,
        color: initialData.color,
        iconId: iconId,
        width: initialData.width || '25',
        height: initialData.height || '1',
      });
      
      setSelectedIconId(iconId);
    } else {
      form.reset({
        title: '',
        path: '',
        color: 'blue',
        iconId: 'clipboard',
        width: '25',
        height: '1',
      });
      setSelectedIconId('clipboard');
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = (data: FormSchema) => {
    const iconComponent = getIconComponentById(data.iconId);
    
    onSave({
      title: data.title,
      path: data.path,
      color: data.color,
      icon: iconComponent,
      width: data.width,
      height: data.height,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Card' : 'Novo Card'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <FormField
                  control={form.control}
                  name="color"
                  render={() => (
                    <ColorOptions form={form} />
                  )}
                />

                <DimensionOptions form={form} />
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="iconId"
                  render={() => (
                    <IconSelector 
                      form={form} 
                      selectedIconId={selectedIconId}
                      setSelectedIconId={setSelectedIconId}
                    />
                  )}
                />
              </div>
            </div>
            
            <CardFormPreview 
              title={form.watch('title')} 
              iconId={selectedIconId}
              color={form.watch('color')}
              width={form.watch('width')}
              height={form.watch('height')}
            />
            
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button variant="default" type="submit">
                <Check className="mr-2 h-4 w-4" />
                {initialData ? 'Salvar Alterações' : 'Criar Card'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CardCustomizationModal;
