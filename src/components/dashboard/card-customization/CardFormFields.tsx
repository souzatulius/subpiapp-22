
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormSchema } from "@/types/formSchema";
import IconSelector from "./IconSelector";
import ColorOptions from "./ColorOptions";
import DimensionOptions from "./DimensionOptions";
import { Label } from "@/components/ui/label";

interface CardFormFieldsProps {
  form: UseFormReturn<FormSchema>;
  selectedIconId: string;
  setSelectedIconId: (id: string) => void;
}

export default function CardFormFields({
  form,
  selectedIconId,
  setSelectedIconId,
}: CardFormFieldsProps) {
  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Título</FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o título do card"
                className="border-gray-300"
                {...field}
              />
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
            <FormLabel className="text-gray-700">Subtítulo (opcional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Digite um subtítulo"
                className="border-gray-300"
                {...field}
              />
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
            <FormLabel className="text-gray-700">Caminho (URL)</FormLabel>
            <FormControl>
              <Input
                placeholder="/dashboard/caminho"
                className="border-gray-300"
                {...field}
              />
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
            <FormLabel className="text-gray-700">Tipo</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Padrão</SelectItem>
                <SelectItem value="data_dynamic">Dinâmico</SelectItem>
                <SelectItem value="in_progress_demands">Demandas em Andamento</SelectItem>
                <SelectItem value="recent_notes">Notas Recentes</SelectItem>
                <SelectItem value="origin_selection">Seleção de Origem</SelectItem>
                <SelectItem value="smart_search">Busca Inteligente</SelectItem>
                <SelectItem value="origin_demand_chart">Gráfico de Demandas</SelectItem>
                <SelectItem value="communications">Comunicações</SelectItem>
                <SelectItem value="pending_activities">Atividades Pendentes</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="text-gray-700 block mb-2">Ícone</FormLabel>
        <IconSelector
          selectedIcon={selectedIconId}
          onIconSelect={setSelectedIconId}
        />
      </div>

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Cor</FormLabel>
            <FormControl>
              <ColorOptions
                selectedColor={field.value}
                onColorSelect={(color) => field.onChange(color)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Largura</FormLabel>
              <FormControl>
                <DimensionOptions
                  type="width"
                  selectedValue={field.value}
                  onValueSelect={(width) => field.onChange(width)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Altura</FormLabel>
              <FormControl>
                <DimensionOptions
                  type="height"
                  selectedValue={field.value}
                  onValueSelect={(height) => field.onChange(height)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="displayMobile"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-gray-700">Exibir no mobile</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("displayMobile") && (
        <FormField
          control={form.control}
          name="mobileOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Ordem no Mobile</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className="border-gray-300"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
