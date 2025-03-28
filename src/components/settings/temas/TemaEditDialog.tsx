
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Area, Problem, problemSchema } from '@/hooks/problems/types';
import { CoordinationSelector } from '../selectors/CoordinationSelector';

interface TemaEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Problem | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; coordenacao_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const TemaEditDialog: React.FC<TemaEditDialogProps> = ({
  isOpen,
  onClose,
  tema,
  areas,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      descricao: tema?.descricao || '',
      coordenacao_id: tema?.coordenacao_id || '',
    },
    mode: "onChange"
  });

  React.useEffect(() => {
    if (tema) {
      form.reset({
        descricao: tema.descricao,
        coordenacao_id: tema.coordenacao_id || '',
      });
    }
  }, [tema, form]);

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const isOpenChanged = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpenChanged}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tema</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do tema" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coordenacao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenação</FormLabel>
                  <FormControl>
                    <CoordinationSelector
                      areas={areas}
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aguarde...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TemaEditDialog;
