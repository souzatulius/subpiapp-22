
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service, Area } from '@/hooks/services/types';
import { serviceSchema } from '@/types/service';

interface ServiceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ServiceEditDialog: React.FC<ServiceEditDialogProps> = ({
  isOpen,
  onClose,
  service,
  areas,
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      descricao: service?.descricao || '',
      supervisao_tecnica_id: service?.supervisao_tecnica_id || ''
    }
  });

  useEffect(() => {
    if (service) {
      form.reset({
        descricao: service.descricao || '',
        supervisao_tecnica_id: service.supervisao_tecnica_id || ''
      });
    }
  }, [service, form]);

  const handleSubmit = async (data: z.infer<typeof serviceSchema>) => {
    // Ensure both required fields are non-empty strings before submitting
    if (data.descricao && data.supervisao_tecnica_id) {
      await onSubmit({
        descricao: data.descricao,
        supervisao_tecnica_id: data.supervisao_tecnica_id
      });
      onClose();
    }
  };

  // Filter out areas with empty IDs to prevent Radix UI Select error
  const validAreas = areas.filter(area => area.id && area.id.trim() !== '');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a descrição do serviço" {...field} />
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
                  <FormLabel>Supervisão Técnica</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validAreas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceEditDialog;
