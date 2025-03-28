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
import { IconSelector } from './IconSelector';

interface ProblemEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; coordenacao_id: string; icone?: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ProblemEditDialog: React.FC<ProblemEditDialogProps> = ({
  isOpen,
  onClose,
  problem,
  areas,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      descricao: problem?.descricao || '',
      coordenacao_id: problem?.coordenacao_id || '',
      icone: problem?.icone || 'alert-circle'
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    if (problem) {
      form.reset({
        descricao: problem.descricao,
        coordenacao_id: problem.coordenacao_id || '',
        icone: problem.icone || 'alert-circle'
      });
    }
  }, [problem, form]);

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error is handled in the parent component
      console.error('Error submitting form:', error);
    }
  };

  const isOpenChanged = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpenChanged}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Problema</DialogTitle>
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
                    <Input placeholder="Descrição do problema" {...field} />
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
                  <CoordinationSelector
                    areas={areas}
                    field={field}
                  />
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
                  <IconSelector field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemEditDialog;
