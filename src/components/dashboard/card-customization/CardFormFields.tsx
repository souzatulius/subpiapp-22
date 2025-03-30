
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
import { Switch } from '@/components/ui/switch';
import ColorOptions from './ColorOptions';
import IconSelector from './IconSelector';
import { MultiSelect } from '@/components/ui/multiselect';
import { dashboardPages } from './utils';
import { CardColor } from '@/types/dashboard';

interface Props {
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

const CardFormFields: React.FC<Props> = ({
  form,
  selectedIconId,
  setSelectedIconId
}) => {
  const watchType = form.watch('type');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="Título do card" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione tipo de card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Padrão</SelectItem>
                  <SelectItem value="data_dynamic">Com dados</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchType === 'data_dynamic' && (
        <FormField
          control={form.control}
          name="dataSourceKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fonte de Dados</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSourceOptions.map(opt => (
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

      {watchType === 'standard' && (
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direcionamento</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione página" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboardPages.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
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

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor</FormLabel>
            <FormControl>
              <ColorOptions
                selectedColor={field.value as CardColor}
                onSelectColor={(color: CardColor) => form.setValue('color', color)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="iconId"
        render={() => (
          <FormItem>
            <FormLabel>Ícone</FormLabel>
            <FormControl>
              <IconSelector
                selectedIconId={selectedIconId}
                onSelectIcon={id => {
                  setSelectedIconId(id);
                  form.setValue('iconId', id);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="width"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Largura</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tamanho do card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Altura</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Altura do card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Padrão</SelectItem>
                  <SelectItem value="2">Alta</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="displayMobile"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormLabel>Exibir no mobile</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mobileOrder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ordem no mobile</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

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
                  // outros...
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
