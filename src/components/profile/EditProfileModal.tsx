
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
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ProfileData } from './types';
import { formatDateInput, formatDateToString, parseFormattedDate } from '@/lib/inputFormatting';

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
  const [dateInputValue, setDateInputValue] = useState('');
  
  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<ProfileData>({
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
          let formattedDate = '';
          if (typeof userData.aniversario === 'string') {
            // Format date string to DD/MM/YYYY
            const dateObj = new Date(userData.aniversario);
            formattedDate = formatDateToString(dateObj);
          } else {
            // Already a Date object
            formattedDate = formatDateToString(userData.aniversario);
          }
          
          setDateInputValue(formattedDate);
        } catch (error) {
          console.error('Error parsing date:', error);
          setDateInputValue('');
        }
      } else {
        setDateInputValue('');
      }
    }
  }, [userData, setValue, isOpen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatDateInput(value);
    setDateInputValue(formattedValue);
  };

  const onSubmit = async (data: ProfileData) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      // Parse the formatted date into a Date object
      let parsedDate = null;
      if (dateInputValue) {
        parsedDate = parseFormattedDate(dateInputValue);
        if (!parsedDate) {
          toast({
            title: "Erro",
            description: "Formato de data inválido. Use DD/MM/AAAA.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare data for update
      const updateData = {
        nome_completo: data.nome_completo,
        whatsapp: data.whatsapp || null,
        aniversario: parsedDate ? parsedDate.toISOString() : null
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
    setDateInputValue('');
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
            <Label htmlFor="aniversario">Data de aniversário</Label>
            <Input
              id="aniversario"
              placeholder="DD/MM/AAAA"
              value={dateInputValue}
              onChange={handleDateChange}
              maxLength={10}
            />
            <p className="text-xs text-gray-500">Formato: DD/MM/AAAA</p>
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
