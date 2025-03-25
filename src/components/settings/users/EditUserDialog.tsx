
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { User, UserFormData, Area, Cargo } from './types';
import PositionFields from '@/components/register/form/PositionFields';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  areas: Area[];
  cargos: Cargo[];
  coordenacoes?: {coordenacao_id: string, coordenacao: string}[];
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  areas,
  cargos,
  coordenacoes = []
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<UserFormData>();

  const role = watch('cargo_id') || '';
  const coordenacao = watch('coordenacao_id') || '';
  const area = watch('area_coordenacao_id') || '';

  // Reset form when opening or changing user
  React.useEffect(() => {
    if (user && open) {
      reset({
        nome_completo: user.nome_completo,
        email: user.email,
        cargo_id: user.cargo_id || '',
        coordenacao_id: user.coordenacao_id || user.areas_coordenacao?.coordenacao_id || '',
        area_coordenacao_id: user.area_coordenacao_id || '',
        whatsapp: user.whatsapp || '',
        aniversario: user.aniversario ? new Date(user.aniversario) : undefined
      });
    } else {
      reset({
        nome_completo: '',
        email: '',
        cargo_id: '',
        coordenacao_id: '',
        area_coordenacao_id: '',
        whatsapp: '',
        aniversario: undefined
      });
    }
  }, [user, open, reset]);

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input
              id="nome_completo"
              {...register('nome_completo', { required: 'Nome é obrigatório' })}
            />
            {errors.nome_completo && (
              <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email é obrigatório' })}
              disabled // Email não pode ser alterado
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              {...register('whatsapp')}
              placeholder="(DDD) XXXXX-XXXX"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="aniversario">Data de Aniversário</Label>
            <Input
              id="aniversario"
              type="date"
              {...register('aniversario')}
            />
          </div>

          <PositionFields
            role={role}
            area={area}
            coordenacao={coordenacao}
            roles={cargos.map(cargo => ({ id: cargo.id, value: cargo.descricao }))}
            areas={areas.map(area => ({ id: area.id, value: area.descricao }))}
            coordenacoes={coordenacoes.map(coord => ({ id: coord.coordenacao_id, value: coord.coordenacao }))}
            loadingOptions={false}
            errors={{
              role: !!errors.cargo_id,
              area: !!errors.area_coordenacao_id,
              coordenacao: !!errors.coordenacao_id
            }}
            handleChange={(name, value) => {
              if (name === 'role') {
                setValue('cargo_id', value);
              } else if (name === 'area') {
                setValue('area_coordenacao_id', value);
              } else if (name === 'coordenacao') {
                setValue('coordenacao_id', value);
                if (value) {
                  // Reset area when changing coordenacao
                  setValue('area_coordenacao_id', '');
                }
              }
            }}
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
