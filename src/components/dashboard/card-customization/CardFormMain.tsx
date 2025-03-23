
import React from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
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
  // Use this function to handle the form validation
  const handleFormSubmit = form.handleSubmit(() => {});

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Action buttons at the top */}
        <div className="flex justify-end space-x-2 mb-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" type="submit">
            <Check className="mr-2 h-4 w-4" />
            {initialData ? 'Salvar' : 'Criar Card'}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Card form fields */}
          <div className="w-full md:w-2/3">
            <CardFormFields 
              form={form}
              selectedIconId={selectedIconId}
              setSelectedIconId={setSelectedIconId}
            />
          </div>
          
          {/* Preview next to the form fields */}
          <div className="w-full md:w-1/3">
            <CardFormPreview 
              title={form.watch('title')} 
              iconId={selectedIconId}
              color={form.watch('color')}
              width={form.watch('width')}
              height={form.watch('height')}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CardFormMain;
