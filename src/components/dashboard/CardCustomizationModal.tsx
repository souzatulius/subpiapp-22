
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

// Define color options
const colorOptions = [
  { id: 'blue', label: 'Azul', value: 'blue', bgClass: 'bg-blue-500' },
  { id: 'green', label: 'Verde', value: 'green', bgClass: 'bg-green-500' },
  { id: 'orange', label: 'Laranja', value: 'orange', bgClass: 'bg-orange-500' },
  { id: 'purple', label: 'Roxo', value: 'purple', bgClass: 'bg-purple-500' },
  { id: 'red', label: 'Vermelho', value: 'red', bgClass: 'bg-red-500' },
];

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(50, "O título deve ter no máximo 50 caracteres"),
  path: z.string().min(1, "O caminho é obrigatório"),
  color: z.enum(['blue', 'green', 'orange', 'purple', 'red']),
  iconId: z.string().min(1, "Selecione um ícone"),
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
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red'; 
  }) => void;
  initialData?: {
    id: string;
    title: string;
    icon: React.ReactNode;
    path: string;
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  };
}

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
      // Find the icon ID based on the component
      const iconIdMatch = availableIcons.findIndex(icon => 
        JSON.stringify(icon.component) === JSON.stringify(initialData.icon)
      );
      
      const iconId = iconIdMatch >= 0 ? availableIcons[iconIdMatch].id : 'clipboard';
      
      form.reset({
        title: initialData.title,
        path: initialData.path,
        color: initialData.color,
        iconId: iconId,
      });
      
      setSelectedIconId(iconId);
    } else {
      form.reset({
        title: '',
        path: '',
        color: 'blue',
        iconId: 'clipboard',
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
    });
  };

  // Get the selected color for preview
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'red':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
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
                        <Input placeholder="/dashboard/exemplo" {...field} />
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
                      <div className="grid grid-cols-5 gap-2">
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
                <div className={`cursor-pointer transition-all duration-300 border rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 flex flex-col items-center justify-center h-[140px] w-[120px] ${getColorClass(form.watch('color'))}`}>
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
