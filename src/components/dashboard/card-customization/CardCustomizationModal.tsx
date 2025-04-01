
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionCardItem, CardColor, CardType, CardWidth, CardHeight } from "@/types/dashboard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IconPicker } from "./IconPicker";
import { Loader2 } from "lucide-react";
import CardPreview from "./CardPreview";

export const formSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  subtitle: z.string().optional(),
  path: z.string(),
  color: z.string(),
  width: z.enum(["25", "33", "50", "75", "100"]),
  height: z.enum(["1", "2"]),
  iconId: z.string().optional(),
  type: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormSchema) => void;
  initialData?: ActionCardItem | null;
  limitToBasicEditing?: boolean;
}

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  limitToBasicEditing = false,
}) => {
  // Define default values for the form
  const defaultValues = {
    title: initialData?.title || "Novo Card",
    subtitle: initialData?.subtitle || "",
    path: initialData?.path || "",
    color: initialData?.color || "blue",
    width: (initialData?.width || "25") as CardWidth,
    height: (initialData?.height || "1") as CardHeight,
    iconId: initialData?.iconId || "layout-dashboard",
    type: initialData?.type || "standard",
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue, formState, reset } = form;
  const currentValues = watch();

  React.useEffect(() => {
    if (isOpen && initialData) {
      reset({
        title: initialData.title || "Novo Card",
        subtitle: initialData.subtitle || "",
        path: initialData.path || "",
        color: initialData.color || "blue",
        width: (initialData.width || "25") as CardWidth,
        height: (initialData.height || "1") as CardHeight,
        iconId: initialData.iconId || "layout-dashboard",
        type: initialData.type || "standard",
      });
    } else if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: FormSchema) => {
    onSave(data);
  };

  const colorOptions: Array<{ value: CardColor; label: string; class: string }> = [
    { value: "blue", label: "Azul", class: "bg-blue-500" },
    { value: "green", label: "Verde", class: "bg-green-500" },
    { value: "orange", label: "Laranja", class: "bg-orange-500" },
    { value: "gray-light", label: "Cinza Claro", class: "bg-gray-200" },
    { value: "gray-dark", label: "Cinza Escuro", class: "bg-gray-700" },
    { value: "blue-dark", label: "Azul Escuro", class: "bg-blue-700" },
    { value: "blue-light", label: "Azul Claro", class: "bg-blue-300" },
    { value: "orange-light", label: "Laranja Claro", class: "bg-orange-300" },
    { value: "orange-600", label: "Laranja Médio", class: "bg-orange-600" },
    { value: "gray-ultra-light", label: "Cinza Ultra Claro", class: "bg-gray-100" },
    { value: "lime", label: "Verde Limão", class: "bg-lime-500" },
    { value: "green-light", label: "Verde Claro", class: "bg-green-300" },
    { value: "purple-light", label: "Roxo Claro", class: "bg-purple-300" },
  ];
  
  const widthOptions = [
    { value: "25", label: "25% (1/4 da tela)" },
    { value: "33", label: "33% (1/3 da tela)" },
    { value: "50", label: "50% (1/2 da tela)" },
    { value: "75", label: "75% (3/4 da tela)" },
    { value: "100", label: "100% (Tela inteira)" },
  ];
  
  const heightOptions = [
    { value: "1", label: "Padrão" },
    { value: "2", label: "Dobro da altura" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `Editar Card: ${initialData.title}` : "Criar Novo Card"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                {!limitToBasicEditing && (
                  <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 py-4">
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma cor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full mr-2 ${color.class}`}
                                />
                                <span>{color.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!limitToBasicEditing && (
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtítulo (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Subtítulo do card" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <CardPreview
                  title={currentValues.title}
                  subtitle={currentValues.subtitle}
                  color={currentValues.color as CardColor}
                  iconId={currentValues.iconId}
                />
              </TabsContent>

              {!limitToBasicEditing && (
                <TabsContent value="advanced" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="path"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caminho</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="/rota-do-card"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="iconId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ícone</FormLabel>
                          <FormControl>
                            <IconPicker
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Largura</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a largura" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {widthOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a altura" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {heightOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : initialData ? (
                  "Salvar Alterações"
                ) : (
                  "Criar Card"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CardCustomizationModal;
