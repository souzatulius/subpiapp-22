
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User } from './types';
import { toast } from 'sonner';

interface UserInfoFormProps {
  user?: User;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  whatsapp: z.string().optional(),
  birthday: z.string().optional(),
});

// Export the form values type for other components to use
export type FormValues = z.infer<typeof formSchema>;

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
  onCancel
}) => {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.nome_completo || '',
      email: user?.email || '',
      whatsapp: user?.whatsapp || '',
      birthday: user?.aniversario ? 
        typeof user.aniversario === 'string' ? 
          user.aniversario : 
          format(new Date(user.aniversario), 'yyyy-MM-dd') 
        : '',
    },
    mode: "onChange",
  });

  // Form submission handler
  const handleSubmit = async (data: FormValues) => {
    try {
      // Get values from form
      const userData = {
        nome_completo: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        aniversario: data.birthday || null,
      };

      // Call onSubmit with the updated user data
      await onSubmit(userData);
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar as informações do usuário.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* WhatsApp field */}
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Birthday field */}
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aniversário</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default UserInfoForm;
