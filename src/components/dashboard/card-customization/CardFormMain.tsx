
import React from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { Button } from '@/components/ui/button';
import CardFormPreview from './CardFormPreview';
import CardFormFields from './CardFormFields';

interface CardFormMainProps {
  form: UseFormReturn<FormSchema>;
  onClose: () => void;
  selectedIconId: string;
  setSelectedIconId: (id: string) => void;
  initialData: any;
  onSubmit: (data: FormSchema) => void;
}

const CardFormMain: React.FC<CardFormMainProps> = ({
  form,
  onClose,
  selectedIconId,
  setSelectedIconId,
  initialData,
  onSubmit
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Card form fields - left side */}
          <div className="w-full md:w-1/2">
            <CardFormFields isNewCard={!initialData} />
          </div>
          
          {/* Preview - right side */}
          <div className="w-full md:w-1/2">
            <CardFormPreview 
              title={form.watch('title')} 
              iconId={form.watch('iconId')}
              color={form.watch('color')}
              width={form.watch('width')}
              height={form.watch('height')}
            />
          </div>
        </div>
        
        {/* Action buttons at the bottom */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" type="submit">
            {initialData ? 'Salvar' : 'Criar Card'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CardFormMain;
