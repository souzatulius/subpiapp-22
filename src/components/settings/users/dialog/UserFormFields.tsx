
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
  return (
    <>
      {/* Nome completo */}
      <div className="space-y-1">
        <Label htmlFor="nome_completo">Nome completo</Label>
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
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
            placeholder="(11) 98765-4321"
            className={errors.whatsapp ? 'border-red-500' : ''}
          />
          {errors.whatsapp && (
            <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>
      )}
      
      {/* Birthday field */}
      {showBirthday && (
        <div className="space-y-1">
          <Label htmlFor="aniversario">Data de aniversário</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !watch('aniversario') && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('aniversario') ? (
                  format(watch('aniversario'), 'P', { locale: pt })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch('aniversario')}
                onSelect={(date) => setValue('aniversario', date)}
                locale={pt}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* Cargo */}
      <div className="space-y-1">
        <Label htmlFor="cargo_id">Cargo</Label>
        <Select
          value={watch('cargo_id') || ''}
          onValueChange={(value) => setValue('cargo_id', value)}
        >
          <SelectTrigger id="cargo_id" className={errors.cargo_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum</SelectItem>
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
        <Label htmlFor="coordenacao_id">Coordenação</Label>
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
            <SelectItem value="">Nenhuma</SelectItem>
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
        <Label htmlFor="supervisao_tecnica_id">Supervisão Técnica</Label>
        <Select
          value={watch('supervisao_tecnica_id') || ''}
          onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
          disabled={!coordenacao}
        >
          <SelectTrigger 
            id="supervisao_tecnica_id" 
            className={errors.supervisao_tecnica_id ? 'border-red-500' : ''}
          >
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhuma</SelectItem>
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
      </div>
    </>
  );
};

export default UserFormFields;
