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
import { User, SupervisaoTecnica, Cargo, Coordenacao } from '../types';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { UserFormData } from '../types';

interface UserFormFieldsProps {
  watch: UseFormWatch<UserFormData>;
  setValue: UseFormSetValue<UserFormData>;
  errors: FieldErrors<UserFormData>;
  supervisoesTecnicas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes?: Coordenacao[];
  register: any;
  filteredSupervisoes: SupervisaoTecnica[];
  coordenacao: string;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  watch,
  setValue,
  errors,
  supervisoesTecnicas,
  cargos,
  coordenacoes = [],
  register,
  filteredSupervisoes,
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
          disabled
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
            <SelectItem value="no-selection">Selecione um cargo</SelectItem>
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
            setValue('supervisao_tecnica_id', '');
          }}
        >
          <SelectTrigger id="coordenacao_id" className="rounded-xl border-gray-300 h-12">
            <SelectValue placeholder="Selecione uma coordenação" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="no-coord">Selecione uma coordenação</SelectItem>
            {coordenacoes.map(coord => (
              <SelectItem key={coord.id} value={coord.id}>
                {coord.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.coordenacao_id && (
          <p className="text-sm text-red-500">{errors.coordenacao_id.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="supervisao_tecnica_id" className="text-subpi-gray-text">Supervisão Técnica (Opcional)</Label>
        <Select
          value={watch('supervisao_tecnica_id')}
          onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
          disabled={!coordenacao || coordenacao === 'no-coord'}
        >
          <SelectTrigger id="supervisao_tecnica_id" className="rounded-xl border-gray-300 h-12">
            <SelectValue placeholder={
              !coordenacao || coordenacao === 'no-coord'
                ? 'Selecione uma coordenação primeiro' 
                : filteredSupervisoes.length === 0 
                  ? 'Nenhuma supervisão técnica disponível' 
                  : 'Selecione uma supervisão técnica'
            } />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {!coordenacao || coordenacao === 'no-coord' ? (
              <SelectItem value="no-supervisao">
                Selecione uma coordenação primeiro
              </SelectItem>
            ) : filteredSupervisoes.length === 0 ? (
              <SelectItem value="no-supervisoes">
                Nenhuma supervisão técnica disponível
              </SelectItem>
            ) : (
              <>
                <SelectItem value="no-selection-supervisao">Selecione uma supervisão técnica</SelectItem>
                {filteredSupervisoes.map(supervisao => (
                  <SelectItem key={supervisao.id} value={supervisao.id}>
                    {supervisao.descricao}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
        {errors.supervisao_tecnica_id && (
          <p className="text-sm text-red-500">{errors.supervisao_tecnica_id.message}</p>
        )}
      </div>
    </div>
  );
};

export default UserFormFields;
