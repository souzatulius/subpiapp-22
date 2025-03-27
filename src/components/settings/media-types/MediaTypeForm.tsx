
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Newspaper, Radio, Tv, Smartphone, Mail, MessageSquare, Globe, 
  Instagram, Facebook, Twitter, Youtube, Image, FileText,
  LucideIcon
} from 'lucide-react';

const formSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  icone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MediaTypeFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  initialValues?: FormValues;
  isSubmitting: boolean;
}

const MediaTypeForm: React.FC<MediaTypeFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = { descricao: '', icone: '' },
  isSubmitting
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  });

  const iconOptions = [
    { name: 'Jornal', value: 'Newspaper', icon: Newspaper },
    { name: 'Rádio', value: 'Radio', icon: Radio },
    { name: 'TV', value: 'Tv', icon: Tv },
    { name: 'Aplicativo', value: 'Smartphone', icon: Smartphone },
    { name: 'Email', value: 'Mail', icon: Mail },
    { name: 'Mensagem', value: 'MessageSquare', icon: MessageSquare },
    { name: 'Site', value: 'Globe', icon: Globe },
    { name: 'Instagram', value: 'Instagram', icon: Instagram },
    { name: 'Facebook', value: 'Facebook', icon: Facebook },
    { name: 'Twitter', value: 'Twitter', icon: Twitter },
    { name: 'Youtube', value: 'Youtube', icon: Youtube },
    { name: 'Documento', value: 'FileText', icon: FileText },
    { name: 'Imagem', value: 'Image', icon: Image },
  ];

  const handleSubmit = async (data: FormValues) => {
    console.log('Submitting form with data:', data);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Jornal Online" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MediaTypeForm;
