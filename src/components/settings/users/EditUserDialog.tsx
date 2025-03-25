
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
import { Loader2 } from 'lucide-react';
import { User, UserFormData, Area, Cargo } from './types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
            <Select
              value={watch('cargo_id')}
              onValueChange={(value) => setValue('cargo_id', value)}
            >
              <SelectTrigger id="cargo_id" className="h-10 rounded-md">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-cargo">Selecione um cargo</SelectItem>
                {cargos.map(cargo => (
                  <SelectItem key={cargo.id} value={cargo.id}>
                    {cargo.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cargo_id && (
              <p className="text-sm text-red-500">{errors.cargo_id.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coordenacao_id">Coordenação</Label>
            <Select
              value={watch('coordenacao_id')}
              onValueChange={(value) => {
                setValue('coordenacao_id', value);
                // Reset area_coordenacao_id when coordination changes
                setValue('area_coordenacao_id', '');
              }}
            >
              <SelectTrigger id="coordenacao_id" className="h-10 rounded-md">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-coordenacao">Selecione uma coordenação</SelectItem>
                {coordenacoes.map(coord => (
                  <SelectItem key={coord.coordenacao_id} value={coord.coordenacao_id}>
                    {coord.coordenacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.coordenacao_id && (
              <p className="text-sm text-red-500">{errors.coordenacao_id.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="area_coordenacao_id">Supervisão Técnica (Opcional)</Label>
            <Select
              value={watch('area_coordenacao_id')}
              onValueChange={(value) => setValue('area_coordenacao_id', value)}
              disabled={!coordenacao || coordenacao === 'select-coordenacao'}
            >
              <SelectTrigger id="area_coordenacao_id" className="h-10 rounded-md">
                <SelectValue placeholder={
                  !coordenacao || coordenacao === 'select-coordenacao'
                    ? 'Selecione uma coordenação primeiro' 
                    : filteredAreas.length === 0 
                      ? 'Nenhuma supervisão técnica disponível' 
                      : 'Selecione uma supervisão técnica'
                } />
              </SelectTrigger>
              <SelectContent>
                {!coordenacao || coordenacao === 'select-coordenacao' ? (
                  <SelectItem value="select-area">
                    Selecione uma coordenação primeiro
                  </SelectItem>
                ) : filteredAreas.length === 0 ? (
                  <SelectItem value="select-area">
                    Nenhuma supervisão técnica disponível
                  </SelectItem>
                ) : (
                  <>
                    <SelectItem value="select-area">Selecione uma supervisão técnica</SelectItem>
                    {filteredAreas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.descricao}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
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
