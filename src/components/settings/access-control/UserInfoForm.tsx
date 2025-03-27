
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { User } from './types';
import { formatPhoneNumber, formatDateInput, parseFormattedDate, formatDateToString } from '@/lib/inputFormatting';

export const formSchema = z.object({
  whatsapp: z.string().optional(),
  aniversario: z.string()
    .refine(val => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
      message: "Data deve estar no formato DD/MM/AAAA"
    })
    .refine(val => {
      if (!val) return true;
      const date = parseFormattedDate(val);
      return !!date;
    }, {
      message: "Data inválida"
    })
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface UserInfoFormProps {
  user: User;
  onSubmit: (data: FormValues) => Promise<void>;
  saving: boolean;
  onCancel: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  user,
  onSubmit,
  saving,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatsapp: user?.whatsapp || '',
      aniversario: user?.aniversario ? formatDateToString(new Date(user.aniversario)) : '',
    },
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      form.reset({
        whatsapp: user.whatsapp || '',
        aniversario: user.aniversario ? formatDateToString(new Date(user.aniversario)) : '',
      });
    }
  }, [user, form]);

  // Format WhatsApp number as the user types
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    form.setValue('whatsapp', formattedValue);
  };

  // Format date as the user types
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatDateInput(value);
    form.setValue('aniversario', formattedValue);
  };

  const handleSubmit = async (data: FormValues) => {
    setErrorMessage(null);
    
    // Validate required fields
    if (!form.formState.isValid) {
      setErrorMessage("Por favor, corrija os erros nos campos indicados");
      return;
    }
    
    try {
      await onSubmit(data);
    } catch (error: any) {
      setErrorMessage(error.message || "Ocorreu um erro ao salvar as informações");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="mb-4">
          <div className="font-medium">{user.nome_completo}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(99) 99999-9999" 
                  {...field} 
                  onChange={(e) => {
                    handleWhatsAppChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="aniversario"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Aniversário</FormLabel>
              <FormControl>
                <Input
                  placeholder="DD/MM/AAAA"
                  {...field}
                  onChange={(e) => {
                    handleDateChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserInfoForm;
