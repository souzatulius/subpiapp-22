
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SupervisaoTecnica, Cargo, Coordenacao } from '../types';
import { formatPhoneNumber, formatDateInput } from '@/lib/inputFormatting';

interface UserFormFieldsProps {
  register: any;
  errors: any;
  supervisoesTecnicas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes: Coordenacao[];
  filteredSupervisoes: SupervisaoTecnica[];
  coordenacao: string;
  watch: any;
  setValue: any;
  showWhatsapp?: boolean;
  showBirthday?: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  register,
  errors,
  supervisoesTecnicas,
  cargos,
  coordenacoes,
  filteredSupervisoes,
  coordenacao,
  watch,
  setValue,
  showWhatsapp = false,
  showBirthday = false
}) => {
  // Handle phone number input formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setValue('whatsapp', formattedValue);
  };

  // Handle date input formatting
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value);
    setValue('aniversario', formattedValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Nome completo */}
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="nome_completo" className="font-semibold">Nome completo</Label>
        <Input
          id="nome_completo"
          {...register('nome_completo', { required: 'Nome é obrigatório' })}
          placeholder="Digite o nome completo"
          className={errors.nome_completo ? 'border-red-500' : ''}
        />
        {errors.nome_completo && (
          <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
        )}
      </div>
      
      {/* WhatsApp number */}
      {showWhatsapp && (
        <div className="space-y-1">
          <Label htmlFor="whatsapp" className="font-semibold">WhatsApp</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
            placeholder="(11) 98765-4321"
            className={errors.whatsapp ? 'border-red-500' : ''}
            onChange={handlePhoneChange}
            value={watch('whatsapp') || ''}
          />
          {errors.whatsapp && (
            <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>
      )}
      
      {/* Birthday field as input with mask */}
      {showBirthday && (
        <div className="space-y-1">
          <Label htmlFor="aniversario" className="font-semibold">Data de aniversário</Label>
          <Input
            id="aniversario"
            placeholder="DD/MM/AAAA"
            {...register('aniversario')}
            onChange={handleDateChange}
            value={watch('aniversario') || ''}
            className={errors.aniversario ? 'border-red-500' : ''}
          />
          {errors.aniversario && (
            <p className="text-sm text-red-500">{errors.aniversario.message}</p>
          )}
        </div>
      )}
      
      {/* Cargo */}
      <div className="space-y-1">
        <Label htmlFor="cargo_id" className="font-semibold">Cargo</Label>
        <Select
          value={watch('cargo_id') || ''}
          onValueChange={(value) => setValue('cargo_id', value)}
        >
          <SelectTrigger id="cargo_id" className={errors.cargo_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {cargos.map((cargo) => (
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
      
      {/* Coordenacao */}
      <div className="space-y-1">
        <Label htmlFor="coordenacao_id" className="font-semibold">Coordenação</Label>
        <Select
          value={watch('coordenacao_id') || ''}
          onValueChange={(value) => {
            setValue('coordenacao_id', value);
            if (value !== coordenacao) {
              setValue('supervisao_tecnica_id', '');
            }
          }}
        >
          <SelectTrigger id="coordenacao_id" className={errors.coordenacao_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {coordenacoes.map((coordenacao) => (
              <SelectItem key={coordenacao.id} value={coordenacao.id}>
                {coordenacao.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.coordenacao_id && (
          <p className="text-sm text-red-500">{errors.coordenacao_id.message}</p>
        )}
      </div>
      
      {/* Supervisão Técnica */}
      <div className="space-y-1">
        <Label htmlFor="supervisao_tecnica_id" className="font-semibold">Supervisão Técnica</Label>
        <Select
          value={watch('supervisao_tecnica_id') || ''}
          onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
          disabled={!coordenacao || filteredSupervisoes.length === 0}
        >
          <SelectTrigger 
            id="supervisao_tecnica_id" 
            className={errors.supervisao_tecnica_id ? 'border-red-500' : ''}
          >
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {filteredSupervisoes.map((supervisao) => (
              <SelectItem key={supervisao.id} value={supervisao.id}>
                {supervisao.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.supervisao_tecnica_id && (
          <p className="text-sm text-red-500">{errors.supervisao_tecnica_id.message}</p>
        )}
        {coordenacao && filteredSupervisoes.length === 0 && (
          <p className="text-sm text-gray-500">Não há supervisões técnicas disponíveis para esta coordenação</p>
        )}
      </div>
    </div>
  );
};

export default UserFormFields;
