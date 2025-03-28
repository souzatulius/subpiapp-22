
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProfileData } from './types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: ProfileData | null;
  refreshUserData?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  refreshUserData = () => {} // Provide default empty function
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ProfileData>({
    defaultValues: {
      nome_completo: '',
      whatsapp: '',
      aniversario: undefined
    }
  });

  useEffect(() => {
    if (userData) {
      setValue('nome_completo', userData.nome_completo || '');
      setValue('whatsapp', userData.whatsapp || '');
      
      // Parse aniversario from string to Date if it exists
      if (userData.aniversario) {
        try {
          let dateObj;
          if (typeof userData.aniversario === 'string') {
            // Try to parse the date string
            if (userData.aniversario.includes('T')) {
              // ISO format
              dateObj = new Date(userData.aniversario);
            } else {
              // DD/MM/YYYY format
              dateObj = parse(userData.aniversario, 'dd/MM/yyyy', new Date(), { locale: ptBR });
            }
          } else {
            // Already a Date object
            dateObj = userData.aniversario;
          }
          
          setSelectedDate(dateObj);
          setValue('aniversario', dateObj);
        } catch (error) {
          console.error('Error parsing date:', error);
          setSelectedDate(undefined);
        }
      } else {
        setSelectedDate(undefined);
      }
    }
  }, [userData, setValue]);

  const onSubmit = async (data: ProfileData) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      // Prepare data for update
      const updateData = {
        nome_completo: data.nome_completo,
        whatsapp: data.whatsapp || null,
        aniversario: selectedDate ? selectedDate.toISOString() : null
      };
      
      // Update the user profile in the usuarios table
      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      if (refreshUserData) refreshUserData();
      onClose();
      
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as informações. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações pessoais.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome completo</Label>
            <Input
              id="nome_completo"
              {...register('nome_completo', { required: 'Nome é obrigatório' })}
            />
            {errors.nome_completo && (
              <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              {...register('whatsapp')}
              placeholder="(11) 98765-4321"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Data de aniversário</Label>
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              locale={ptBR}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
