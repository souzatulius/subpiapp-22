
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { User, Area, Cargo } from '../types';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { UserFormData } from '../types';

interface UserFormFieldsProps {
  watch: UseFormWatch<UserFormData>;
  setValue: UseFormSetValue<UserFormData>;
  errors: FieldErrors<UserFormData>;
  areas: Area[];
  cargos: Cargo[];
  coordenacoes?: {coordenacao_id: string, coordenacao: string}[];
  register: any;
  filteredAreas: Area[];
  coordenacao: string;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  watch,
  setValue,
  errors,
  areas,
  cargos,
  coordenacoes = [],
  register,
  filteredAreas,
  coordenacao
}) => {
  return (
    <div className="space-y-5 bg-white p-5 rounded-xl">
      <div className="grid gap-2">
        <Label htmlFor="nome_completo" className="text-subpi-gray-text">Nome Completo</Label>
        <Input
          id="nome_completo"
          className="rounded-xl border-gray-300 focus:border-subpi-blue focus:ring-subpi-blue"
          {...register('nome_completo', { required: 'Nome é obrigatório' })}
        />
        {errors.nome_completo && (
          <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-subpi-gray-text">Email</Label>
        <Input
          id="email"
          type="email"
          className="rounded-xl border-gray-300 bg-gray-100"
          {...register('email', { required: 'Email é obrigatório' })}
          disabled // Email não pode ser alterado
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="whatsapp" className="text-subpi-gray-text">WhatsApp</Label>
        <Input
          id="whatsapp"
          className="rounded-xl border-gray-300 focus:border-subpi-blue focus:ring-subpi-blue"
          {...register('whatsapp')}
          placeholder="(DDD) XXXXX-XXXX"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="aniversario" className="text-subpi-gray-text">Data de Aniversário</Label>
        <Input
          id="aniversario"
          type="date"
          className="rounded-xl border-gray-300 focus:border-subpi-blue focus:ring-subpi-blue"
          {...register('aniversario')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cargo_id" className="text-subpi-gray-text">Cargo</Label>
        <Select
          value={watch('cargo_id')}
          onValueChange={(value) => setValue('cargo_id', value)}
        >
          <SelectTrigger id="cargo_id" className="rounded-xl border-gray-300 h-12">
            <SelectValue placeholder="Selecione um cargo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
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
        <Label htmlFor="coordenacao_id" className="text-subpi-gray-text">Coordenação</Label>
        <Select
          value={watch('coordenacao_id')}
          onValueChange={(value) => {
            setValue('coordenacao_id', value);
            // Reset area_coordenacao_id when coordination changes
            setValue('area_coordenacao_id', '');
          }}
        >
          <SelectTrigger id="coordenacao_id" className="rounded-xl border-gray-300 h-12">
            <SelectValue placeholder="Selecione uma coordenação" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
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
        <Label htmlFor="area_coordenacao_id" className="text-subpi-gray-text">Supervisão Técnica (Opcional)</Label>
        <Select
          value={watch('area_coordenacao_id')}
          onValueChange={(value) => setValue('area_coordenacao_id', value)}
          disabled={!coordenacao || coordenacao === 'select-coordenacao'}
        >
          <SelectTrigger id="area_coordenacao_id" className="rounded-xl border-gray-300 h-12">
            <SelectValue placeholder={
              !coordenacao || coordenacao === 'select-coordenacao'
                ? 'Selecione uma coordenação primeiro' 
                : filteredAreas.length === 0 
                  ? 'Nenhuma supervisão técnica disponível' 
                  : 'Selecione uma supervisão técnica'
            } />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
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
    </div>
  );
};

export default UserFormFields;
