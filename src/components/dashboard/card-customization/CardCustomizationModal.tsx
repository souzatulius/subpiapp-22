
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
      type: 'standard',
      path: '',
      color: 'blue',
      iconId: 'clipboard-list',
      width: '25',
      height: '1',
      allowedDepartments: [],
      allowedRoles: [],
      displayMobile: true,
      dataSourceKey: ''
    }
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Find the icon ID based on the component type
      const iconId = identifyIconComponent(initialData.icon);
      form.reset({
        title: initialData.title,
        type: initialData.type || 'standard',
        path: initialData.path,
        color: initialData.color,
        iconId: iconId,
        width: initialData.width || '25',
        height: initialData.height || '1',
        dataSourceKey: initialData.dataSourceKey,
        allowedDepartments: initialData.allowedDepartments || [],
        allowedRoles: initialData.allowedRoles || [],
        displayMobile: initialData.displayMobile ?? true
      });
      setSelectedIconId(iconId);
    } else {
      form.reset({
        title: '',
        type: 'standard',
        path: '',
        color: 'blue',
        iconId: 'clipboard-list',
        width: '25',
        height: '1',
        allowedDepartments: [],
        allowedRoles: [],
        displayMobile: true,
        dataSourceKey: ''
      });
      setSelectedIconId('clipboard-list');
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = (data: FormSchema) => {
    // Get the proper React element for the icon (not the raw component)
    const iconComponent = getIconComponentById(data.iconId);
    onSave({
      title: data.title, 
      type: data.type,
      path: data.path,
      color: data.color, // Ensuring color is always passed
      width: data.width,
      height: data.height,
      icon: iconComponent,
      dataSourceKey: data.dataSourceKey,
      displayMobile: data.displayMobile,
      allowedDepartments: data.allowedDepartments,
      allowedRoles: data.allowedRoles
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
    </Dialog>
  );
};

export default CardCustomizationModal;
