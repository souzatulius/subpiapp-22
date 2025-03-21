
import React from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import CardFormPreview from './CardFormPreview';
import CardFormFields from './CardFormFields';

interface CardFormMainProps {
  form: UseFormReturn<FormSchema>;
  onClose: () => void;
  selectedIconId: string;
  setSelectedIconId: (id: string) => void;
  initialData: any;
}

const CardFormMain: React.FC<CardFormMainProps> = ({
  form,
  onClose,
  selectedIconId,
  setSelectedIconId,
  initialData
}) => {
  const onSubmit = form.handleSubmit((data) => {
    // The actual submission logic is handled in the parent component
    // This just triggers the form validation and passes the data up
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Action buttons at the top */}
        <div className="flex justify-end space-x-2 mb-4">
          <Button variant="outline" type="button" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button variant="default" type="submit">
            <Check className="mr-2 h-4 w-4" />
            {initialData ? 'Salvar Alterações' : 'Criar Card'}
          </Button>
        </div>
        
        {/* Card form fields */}
        <CardFormFields 
          form={form}
          selectedIconId={selectedIconId}
          setSelectedIconId={setSelectedIconId}
        />
        
        {/* Preview below the form fields */}
        <CardFormPreview 
          title={form.watch('title')} 
          iconId={selectedIconId}
          color={form.watch('color')}
          width={form.watch('width')}
          height={form.watch('height')}
        />
      </form>
    </Form>
  );
};

export default CardFormMain;
