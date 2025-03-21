
import React from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit} className="space-y-6">
        <CardFormFields 
          form={form}
          selectedIconId={selectedIconId}
          setSelectedIconId={setSelectedIconId}
        />
        
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
  );
};

export default CardFormMain;
