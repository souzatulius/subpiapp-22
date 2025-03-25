
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Form validation schema
const coordinationSchema = z.object({
  descricao: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres" }),
  sigla: z.string().optional(),
});

type CoordinationFormData = z.infer<typeof coordinationSchema>;

interface CoordinationFormProps {
  onSubmit: (data: CoordinationFormData) => Promise<void>;
  onCancel: () => void;
  defaultValues?: CoordinationFormData;
  isSubmitting: boolean;
}

const CoordinationForm: React.FC<CoordinationFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = { descricao: '', sigla: '' },
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CoordinationFormData>({
    resolver: zodResolver(coordinationSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          {...register("descricao")}
          className={errors.descricao ? "border-red-500" : ""}
        />
        {errors.descricao && (
          <p className="text-red-500 text-sm">{errors.descricao.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sigla">Sigla (opcional)</Label>
        <Input
          id="sigla"
          {...register("sigla")}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default CoordinationForm;
