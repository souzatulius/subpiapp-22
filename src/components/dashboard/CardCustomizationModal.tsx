
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Check, 
  X, 
  AlertTriangle,
  BarChart2, 
  Bell, 
  BookOpen, 
  Calendar, 
  Camera, 
  ClipboardList, 
  FileCheck, 
  FileText, 
  Flag, 
  Home, 
  Image, 
  LayoutDashboard, 
  Map, 
  MessageSquareReply, 
  PieChart, 
  Search, 
  Settings, 
  Users
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define dashboard pages for redirection
const dashboardPages = [
  { value: '/dashboard', label: 'Dashboard Principal' },
  { value: '/dashboard/comunicacao', label: 'Comunicação' },
  { value: '/dashboard/comunicacao/cadastrar', label: 'Nova Demanda' },
  { value: '/dashboard/comunicacao/responder', label: 'Responder Demandas' },
  { value: '/dashboard/comunicacao/aprovar-nota', label: 'Aprovar Nota' },
  { value: '/dashboard/comunicacao/relatorios', label: 'Relatórios de Comunicação' },
  { value: '/dashboard/comunicacao/consultar-demandas', label: 'Consultar Demandas' },
  { value: '/dashboard/comunicacao/consultar-notas', label: 'Consultar Notas' },
  { value: '/dashboard/comunicacao/criar-nota', label: 'Criar Nota Oficial' },
  { value: '/dashboard/zeladoria/ranking-subs', label: 'Ranking Subprefeituras' },
  { value: '/dashboard/projetos', label: 'Projetos' },
  { value: '/dashboard/projetos/relatorios', label: 'Relatórios de Projetos' }
];

// Define available icons
const availableIcons = [
  { id: 'clipboard', component: <ClipboardList className="h-12 w-12" />, label: 'Prancheta' },
  { id: 'message', component: <MessageSquareReply className="h-12 w-12" />, label: 'Mensagem' },
  { id: 'check', component: <FileCheck className="h-12 w-12" />, label: 'Verificação' },
  { id: 'chart', component: <BarChart2 className="h-12 w-12" />, label: 'Gráfico' },
  { id: 'file', component: <FileText className="h-12 w-12" />, label: 'Documento' },
  { id: 'search', component: <Search className="h-12 w-12" />, label: 'Pesquisa' },
  { id: 'book', component: <BookOpen className="h-12 w-12" />, label: 'Livro' },
  { id: 'bell', component: <Bell className="h-12 w-12" />, label: 'Notificação' },
  { id: 'calendar', component: <Calendar className="h-12 w-12" />, label: 'Calendário' },
  { id: 'users', component: <Users className="h-12 w-12" />, label: 'Usuários' },
  { id: 'camera', component: <Camera className="h-12 w-12" />, label: 'Câmera' },
  { id: 'image', component: <Image className="h-12 w-12" />, label: 'Imagem' },
  { id: 'flag', component: <Flag className="h-12 w-12" />, label: 'Bandeira' },
  { id: 'map', component: <Map className="h-12 w-12" />, label: 'Mapa' },
  { id: 'home', component: <Home className="h-12 w-12" />, label: 'Casa' },
  { id: 'settings', component: <Settings className="h-12 w-12" />, label: 'Configurações' },
  { id: 'dashboard', component: <LayoutDashboard className="h-12 w-12" />, label: 'Dashboard' },
  { id: 'pie', component: <PieChart className="h-12 w-12" />, label: 'Gráfico Pizza' },
  { id: 'alert', component: <AlertTriangle className="h-12 w-12" />, label: 'Alerta' },
];

// Define color options - expanded with new colors
const colorOptions = [
  { id: 'blue', label: 'Azul', value: 'blue', bgClass: 'bg-blue-500' },
  { id: 'blue-dark', label: 'Azul Escuro', value: 'blue-dark', bgClass: 'bg-subpi-blue' },
  { id: 'green', label: 'Verde', value: 'green', bgClass: 'bg-green-500' },
  { id: 'orange', label: 'Laranja', value: 'orange', bgClass: 'bg-orange-500' },
  { id: 'orange-light', label: 'Laranja Claro', value: 'orange-light', bgClass: 'bg-amber-500' },
  { id: 'purple', label: 'Roxo', value: 'purple', bgClass: 'bg-purple-500' },
  { id: 'red', label: 'Vermelho', value: 'red', bgClass: 'bg-red-500' },
  { id: 'gray-light', label: 'Cinza Claro', value: 'gray-light', bgClass: 'bg-gray-300' },
  { id: 'gray-dark', label: 'Cinza Escuro', value: 'gray-dark', bgClass: 'bg-gray-700' },
];

// Width options
const widthOptions = [
  { id: '25', label: '25%', value: '25' },
  { id: '50', label: '50%', value: '50' },
  { id: '75', label: '75%', value: '75' },
  { id: '100', label: '100%', value: '100' },
];

// Height options
const heightOptions = [
  { id: '1', label: '1 linha', value: '1' },
  { id: '2', label: '2 linhas', value: '2' },
];

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(50, "O título deve ter no máximo 50 caracteres"),
  path: z.string().min(1, "O caminho é obrigatório"),
  color: z.enum(['blue', 'green', 'orange', 'purple', 'red', 'gray-light', 'gray-dark', 'blue-dark', 'orange-light']),
  iconId: z.string().min(1, "Selecione um ícone"),
  width: z.enum(['25', '50', '75', '100']),
  height: z.enum(['1', '2']),
});

type FormSchema = z.infer<typeof formSchema>;

// Component properties
interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { 
    title: string; 
    icon: React.ReactNode; 
    path: string; 
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
    width?: '25' | '50' | '75' | '100';
    height?: '1' | '2';
  }) => void;
  initialData?: {
    id: string;
    title: string;
    icon: React.ReactNode;
    path: string;
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
    width?: '25' | '50' | '75' | '100';
    height?: '1' | '2';
  };
}

// Helper function to identify which icon is being used
const identifyIconComponent = (iconElement: React.ReactNode): string => {
  // This is a new helper function that identifies icons by their props
  if (!iconElement || typeof iconElement !== 'object') return 'clipboard';
  
  // Need to check if element has properties and type
  const element = iconElement as any;
  
  if (!element.type || !element.props || !element.props.className) return 'clipboard';
  
  // For Lucide icons, we can use the component's displayName or check properties
  if (element.props.className.includes('h-12 w-12')) {
    // Check each Lucide icon's display name
    if (element.type === ClipboardList) return 'clipboard';
    if (element.type === MessageSquareReply) return 'message';
    if (element.type === FileCheck) return 'check';
    if (element.type === BarChart2) return 'chart';
    if (element.type === FileText) return 'file';
    if (element.type === Search) return 'search';
    if (element.type === BookOpen) return 'book';
    if (element.type === Bell) return 'bell';
    if (element.type === Calendar) return 'calendar';
    if (element.type === Users) return 'users';
    if (element.type === Camera) return 'camera';
    if (element.type === Image) return 'image';
    if (element.type === Flag) return 'flag';
    if (element.type === Map) return 'map';
    if (element.type === Home) return 'home';
    if (element.type === Settings) return 'settings';
    if (element.type === LayoutDashboard) return 'dashboard';
    if (element.type === PieChart) return 'pie';
    if (element.type === AlertTriangle) return 'alert';
  }
  
  // Default to clipboard if we can't identify the icon
  return 'clipboard';
};

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [selectedIconId, setSelectedIconId] = useState<string>('clipboard');
  
  // Set up form with validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      path: '',
      color: 'blue',
      iconId: 'clipboard',
      width: '25',
      height: '1',
    },
  });

  // Find icon component by ID
  const getIconComponentById = (id: string): React.ReactNode => {
    const icon = availableIcons.find(icon => icon.id === id);
    return icon ? icon.component : availableIcons[0].component;
  };

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Find the icon ID based on the component type - now using our safer method
      const iconId = identifyIconComponent(initialData.icon);
      
      form.reset({
        title: initialData.title,
        path: initialData.path,
        color: initialData.color,
        iconId: iconId,
        width: initialData.width || '25',
        height: initialData.height || '1',
      });
      
      setSelectedIconId(iconId);
    } else {
      form.reset({
        title: '',
        path: '',
        color: 'blue',
        iconId: 'clipboard',
        width: '25',
        height: '1',
      });
      setSelectedIconId('clipboard');
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = (data: FormSchema) => {
    const iconComponent = getIconComponentById(data.iconId);
    
    onSave({
      title: data.title,
      path: data.path,
      color: data.color,
      icon: iconComponent,
      width: data.width,
      height: data.height,
    });
  };

  // Get the selected color for preview
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'blue-dark':
        return 'bg-subpi-blue text-white border-subpi-blue';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'orange-light':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'red':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'gray-light':
        return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'gray-dark':
        return 'bg-gray-700 text-white border-gray-600';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Card' : 'Novo Card'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título do card" {...field} />
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
                      <FormLabel>Link de Redirecionamento</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
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
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {colorOptions.map((color) => (
                          <div
                            key={color.id}
                            className={`cursor-pointer p-2 rounded-md border-2 ${
                              field.value === color.value
                                ? 'border-gray-900 shadow-md'
                                : 'border-transparent'
                            }`}
                            onClick={() => form.setValue('color', color.value as any)}
                          >
                            <div
                              className={`w-full h-8 ${color.bgClass} rounded-md flex items-center justify-center`}
                            >
                              {field.value === color.value && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <span className="mt-1 text-xs text-center block">
                              {color.label}
                            </span>
                          </div>
                        ))}
                      </div>
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
                        <FormLabel>Largura</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {widthOptions.map((option) => (
                              <div key={option.id}>
                                <RadioGroupItem
                                  value={option.value}
                                  id={`width-${option.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`width-${option.id}`}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-2 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-subpi-blue peer-data-[state=checked]:text-subpi-blue"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
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
                        <FormLabel>Altura</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {heightOptions.map((option) => (
                              <div key={option.id}>
                                <RadioGroupItem
                                  value={option.value}
                                  id={`height-${option.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`height-${option.id}`}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-2 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-subpi-blue peer-data-[state=checked]:text-subpi-blue"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="iconId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone</FormLabel>
                      <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto p-1">
                        {availableIcons.map((icon) => (
                          <div
                            key={icon.id}
                            className={`cursor-pointer p-2 rounded-md border-2 ${
                              field.value === icon.id
                                ? 'border-gray-900 shadow-md'
                                : 'border-transparent'
                            }`}
                            onClick={() => {
                              form.setValue('iconId', icon.id);
                              setSelectedIconId(icon.id);
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <div className="text-gray-600">{icon.component}</div>
                              <span className="mt-1 text-xs text-center">
                                {icon.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Label>Preview</Label>
              <div className="mt-2 flex justify-center">
                <div 
                  className={`cursor-pointer transition-all duration-300 border rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 flex flex-col items-center justify-center 
                    ${form.watch('height') === '2' ? 'h-[220px]' : 'h-[140px]'} 
                    ${form.watch('width') === '100' ? 'w-[280px]' : 
                      form.watch('width') === '75' ? 'w-[240px]' : 
                      form.watch('width') === '50' ? 'w-[180px]' : 'w-[120px]'} 
                    ${getColorClass(form.watch('color'))}`}
                >
                  <div className="mb-4">
                    {getIconComponentById(selectedIconId)}
                  </div>
                  <h3 className="text-lg font-medium text-center">{form.watch('title') || 'Título do Card'}</h3>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button variant="default" type="submit">
                <Check className="mr-2 h-4 w-4" />
                {initialData ? 'Salvar Alterações' : 'Criar Card'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CardCustomizationModal;

