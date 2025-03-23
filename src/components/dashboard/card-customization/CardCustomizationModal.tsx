
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormSchema, CardCustomizationModalProps, formSchema } from './types';
import { identifyIconComponent } from './utils';
import CardFormMain from './CardFormMain';
import { getIconComponentById } from './utils';

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [selectedIconId, setSelectedIconId] = useState<string>('clipboard-list');

  // Set up form with validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      path: '',
      color: 'blue',
      iconId: 'clipboard-list',
      width: '25',
      height: '1'
    }
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Find the icon ID based on the component type
      const iconId = identifyIconComponent(initialData.icon);
      form.reset({
        title: initialData.title,
        path: initialData.path,
        color: initialData.color,
        iconId: iconId,
        width: initialData.width || '25',
        height: initialData.height || '1'
      });
      setSelectedIconId(iconId);
    } else {
      form.reset({
        title: '',
        path: '',
        color: 'blue',
        iconId: 'clipboard-list',
        width: '25',
        height: '1'
      });
      setSelectedIconId('clipboard-list');
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
      height: data.height
    });
  };

  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-100 rounded-xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Card' : 'Novo Card'}</DialogTitle>
        </DialogHeader>
        
        <CardFormMain 
          form={form} 
          onClose={onClose} 
          selectedIconId={selectedIconId} 
          setSelectedIconId={setSelectedIconId} 
          initialData={initialData}
          onSubmit={handleSubmit}  
        />
      </DialogContent>
    </Dialog>;
};

export default CardCustomizationModal;
