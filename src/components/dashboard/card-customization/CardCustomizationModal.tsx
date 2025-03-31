
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormSchema, CardCustomizationModalProps, formSchema } from './types';
import { identifyIconComponent, getIconComponentById } from './utils';
import CardFormMain from './CardFormMain';

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [selectedIconId, setSelectedIconId] = useState<string>('Layout');

  // Set up form with validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'standard',
      path: '',
      color: 'blue',
      iconId: 'Layout',
      width: '25',
      height: '1',
      allowedDepartments: [],
      allowedRoles: [],
      displayMobile: true,
      dataSourceKey: '',
      customProperties: {
        description: '',
        gradient: 'bg-gradient-to-r from-blue-600 to-blue-800'
      }
    }
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Find the icon ID based on the component type if available
      const iconId = initialData.iconId || (initialData.icon ? identifyIconComponent(initialData.icon) : 'Layout');
      
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
        displayMobile: initialData.displayMobile ?? true,
        customProperties: initialData.customProperties || {
          description: '',
          gradient: 'bg-gradient-to-r from-blue-600 to-blue-800'
        }
      });
      setSelectedIconId(iconId);
    } else {
      form.reset({
        title: '',
        type: 'standard',
        path: '',
        color: 'blue',
        iconId: 'Layout',
        width: '25',
        height: '1',
        allowedDepartments: [],
        allowedRoles: [],
        displayMobile: true,
        dataSourceKey: '',
        customProperties: {
          description: '',
          gradient: 'bg-gradient-to-r from-blue-600 to-blue-800'
        }
      });
      setSelectedIconId('Layout');
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
      iconId: data.iconId,
      dataSourceKey: data.dataSourceKey,
      displayMobile: data.displayMobile,
      allowedDepartments: data.allowedDepartments,
      allowedRoles: data.allowedRoles,
      customProperties: data.customProperties
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
