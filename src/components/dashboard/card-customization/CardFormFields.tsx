
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardTypeSelector } from "./CardTypeSelector";
import { ColorSelector } from "./ColorSelector";
import { IconSelector } from "./IconSelector";
import { CardSizeSelector } from "./CardSizeSelector";
import { FormSchema } from "@/types/formSchema";
import { MultiSelect } from "@/components/ui/multi-select";

interface CardFormFieldsProps {
  form: UseFormReturn<FormSchema>;
  selectedIconId: string;
  setSelectedIconId: React.Dispatch<React.SetStateAction<string>>;
  hideExtraFields?: boolean;
}

const CardFormFields: React.FC<CardFormFieldsProps> = ({ 
  form, 
  selectedIconId, 
  setSelectedIconId,
  hideExtraFields = false
}) => {
  const departments = [
    { value: 'coordenacao', label: 'Coordenação' },
    { value: 'supervisao', label: 'Supervisão' },
    { value: 'zeladoria', label: 'Zeladoria' },
    { value: 'comunicacao', label: 'Comunicação' }
  ];

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'coordenador', label: 'Coordenador' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'tecnico', label: 'Técnico' }
  ];

  return (
    <>
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
        name="subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtítulo</FormLabel>
            <FormControl>
              <Textarea placeholder="Descrição breve (opcional)" rows={1} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="path"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link (Path)</FormLabel>
            <FormControl>
              <Input placeholder="/dashboard/pagina" {...field} />
            </FormControl>
            <FormDescription>
              Caminho para onde o card irá direcionar o usuário
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <IconSelector 
            selectedIconId={selectedIconId} 
            onSelectIcon={setSelectedIconId} 
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do card</FormLabel>
                <FormControl>
                  <ColorSelector value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largura</FormLabel>
                <FormControl>
                  <CardSizeSelector 
                    type="width" 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura</FormLabel>
                <FormControl>
                  <CardSizeSelector 
                    type="height" 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {!hideExtraFields && (
        <>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do card</FormLabel>
                <FormControl>
                  <CardTypeSelector value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  Define o comportamento e funcionalidades do card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataSourceKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fonte de dados</FormLabel>
                <FormControl>
                  <Input placeholder="Chave para fonte de dados dinâmicos" {...field} />
                </FormControl>
                <FormDescription>
                  Usado para cards de dados dinâmicos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowedDepartments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamentos permitidos</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={departments}
                    value={field.value?.map(dept => ({ value: dept, label: departments.find(d => d.value === dept)?.label || dept }))}
                    onChange={(selected) => field.onChange(selected.map(item => item.value))}
                    placeholder="Todos os departamentos"
                  />
                </FormControl>
                <FormDescription>
                  Deixe vazio para permitir todos os departamentos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowedRoles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargos permitidos</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={roles}
                    value={field.value?.map(role => ({ value: role, label: roles.find(r => r.value === role)?.label || role }))}
                    onChange={(selected) => field.onChange(selected.map(item => item.value))}
                    placeholder="Todos os cargos"
                  />
                </FormControl>
                <FormDescription>
                  Deixe vazio para permitir todos os cargos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};

export default CardFormFields;
