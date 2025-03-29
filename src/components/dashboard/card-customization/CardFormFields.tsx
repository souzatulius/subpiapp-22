import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { dashboardPages } from './utils';
import ColorOptions from './ColorOptions';
import IconSelector from './IconSelector';
import { MultiSelect } from '@/components/ui/multiselect'; // componente personalizado, caso você já tenha

interface CardFormFieldsProps {
  form: UseFormReturn<FormSchema>;
  selectedIconId: string;
  setSelectedIconId: (id: string) => void;
}

const dataSourceOptions = [
  { label: 'Pendências da Coordenação', value: 'pendencias_por_coordenacao' },
  { label: 'Notas aguardando aprovação', value: 'notas_aguardando_aprovacao' },
  { label: 'Respostas atrasadas', value: 'respostas_atrasadas' },
  { label: 'Demandas aguardando nota', value: 'demandas_aguardando_nota' },
  { label: 'Últimas ações da coordenação', value: 'ultimas_acoes_coordenacao' },
  { label: 'Comunicados por cargo', value: 'comunicados_por_cargo' }
];

const CardFormFields: React.FC<CardFormFieldsProps> = ({
  form,
  selectedIconId,
  setSelectedIconId
}) => {
  const watchType = form.watch('type');

  return (
    <div className="space-y-4">
      {/* Título */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título do Card</FormLabel>
            <FormControl>
              <Input placeholder="Digite o título do card" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tipo de Card */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo do Card</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Card padrão</SelectItem>
                  <SelectItem value="data_dynamic">Card com dados</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fonte de Dados */}
      {watchType === 'data_dynamic' && (
        <FormField
          control={form.control}
          name="dataSourceKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fonte de Dados</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fonte de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSourceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Direcionamento (opcional para data_dynamic) */}
      {watchType !== 'data_dynamic' && (
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direcionamento do Card</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma página" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboardPages.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Cor */}
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor do Card</FormLabel>
            <FormControl>
              <ColorOptions
                selectedColor={field.value}
                onSelectColor={(color) => form.setValue('color', color as any)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ícone */}
      <FormField
        control={form.control}
        name="iconId"
        render={() => (
          <FormItem>
            <FormLabel>Ícone</FormLabel>
            <FormControl>
              <IconSelector
                selectedIconId={selectedIconId}
                onSelectIcon={(id) => {
                  setSelectedIconId(id);
                  form.setValue('iconId', id);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Permissões */}
      <FormField
        control={form.control}
        name="allowedDepartments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamentos Permitidos</FormLabel>
            <FormControl>
              <MultiSelect
                selected={field.value || []}
                onChange={field.onChange}
                placeholder="Selecione departamentos"
                options={[
                  { label: 'Comunicação', value: 'ae3f06da-5cbe-4f23-8ad7-c019d31be124' }
                  // ...outros se necessário
                ]}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allowedRoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargos Permitidos</FormLabel>
            <FormControl>
              <MultiSelect
                selected={field.value || []}
                onChange={field.onChange}
                placeholder="Selecione cargos"
                options={[
                  { label: 'Coordenador', value: 'coordenador' },
                  { label: 'Analista', value: 'analista' }
                  // etc.
                ]}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CardFormFields;
