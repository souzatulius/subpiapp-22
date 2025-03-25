
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

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  areas: Area[];
  cargos: Cargo[];
  coordenacoes?: {coordenacao_id: string, coordenacao: string}[];
  isSubmitting?: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  areas,
  cargos,
  coordenacoes = [],
  isSubmitting = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<UserFormData>();

  const coordenacao = watch('coordenacao_id') || '';
  
  // Filter areas based on the selected coordination
  const filteredAreas = React.useMemo(() => {
    if (!coordenacao || coordenacao === 'select-coordenacao') return [];
    return areas.filter(a => a.coordenacao_id === coordenacao);
  }, [areas, coordenacao]);

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

          <div className="grid gap-2">
            <Label htmlFor="cargo_id">Cargo</Label>
            <select
              id="cargo_id"
              {...register('cargo_id')}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-subpi-blue focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
            >
              <option value="select-cargo">Selecione um cargo</option>
              {cargos.map(cargo => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.descricao}
                </option>
              ))}
            </select>
            {errors.cargo_id && (
              <p className="text-sm text-red-500">{errors.cargo_id.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coordenacao_id">Coordenação</Label>
            <select
              id="coordenacao_id"
              {...register('coordenacao_id')}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-subpi-blue focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
              onChange={(e) => {
                setValue('coordenacao_id', e.target.value);
                // Reset area_coordenacao_id when coordination changes
                setValue('area_coordenacao_id', '');
              }}
            >
              <option value="select-coordenacao">Selecione uma coordenação</option>
              {coordenacoes.map(coord => (
                <option key={coord.coordenacao_id} value={coord.coordenacao_id}>
                  {coord.coordenacao}
                </option>
              ))}
            </select>
            {errors.coordenacao_id && (
              <p className="text-sm text-red-500">{errors.coordenacao_id.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="area_coordenacao_id">Supervisão Técnica (Opcional)</Label>
            <select
              id="area_coordenacao_id"
              {...register('area_coordenacao_id')}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-subpi-blue focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
              disabled={!coordenacao || coordenacao === 'select-coordenacao' || filteredAreas.length === 0}
            >
              <option value="select-area">
                {!coordenacao || coordenacao === 'select-coordenacao'
                  ? 'Selecione uma coordenação primeiro' 
                  : filteredAreas.length === 0 
                    ? 'Nenhuma supervisão técnica disponível' 
                    : 'Selecione uma supervisão técnica'}
              </option>
              {filteredAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.descricao}
                </option>
              ))}
            </select>
            {errors.area_coordenacao_id && (
              <p className="text-sm text-red-500">{errors.area_coordenacao_id.message}</p>
            )}
          </div>

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
