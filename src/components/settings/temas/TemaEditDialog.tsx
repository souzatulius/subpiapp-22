import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { problemSchema } from '@/hooks/problems/types';
import { Problem } from '@/hooks/problems/types';
import { Area } from '@/hooks/coordination-areas/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TemaEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Problem | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const TemaEditDialog: React.FC<TemaEditDialogProps> = ({ isOpen, onClose, tema, areas, onSubmit, isSubmitting }) => {
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      descricao: tema?.descricao || '',
      supervisao_tecnica_id: tema?.supervisao_tecnica_id || '',
    }
  });

  React.useEffect(() => {
    if (tema) {
      form.reset({
        descricao: tema.descricao,
        supervisao_tecnica_id: tema.supervisao_tecnica_id,
      });
    }
  }, [tema, form]);

  const handleSubmit = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao editar tema:', error);
    }
  };

  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl text-subpi-blue font-semibold">Editar Tema</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="bg-white p-5 rounded-xl space-y-4">
              <FormField 
                control={form.control} 
                name="descricao" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-subpi-gray-text">Descrição</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descrição do tema" 
                        {...field} 
                        className="rounded-xl border-gray-300 focus:border-subpi-blue focus:ring-subpi-blue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                control={form.control} 
                name="supervisao_tecnica_id" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-subpi-gray-text">Supervisão Técnica</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Selecione uma supervisão técnica" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {areas.map(area => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isSubmitting}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-xl bg-subpi-blue hover:bg-subpi-blue-dark"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TemaEditDialog;
