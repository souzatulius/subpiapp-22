
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
import { toast } from '@/components/ui/use-toast';
import { ProfileData } from './types';
import { formatDateInput, formatPhoneNumber, formatDateToString, parseFormattedDate } from '@/lib/inputFormatting';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: ProfileData | null;
  refreshUserData?: () => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  refreshUserData = () => Promise.resolve()
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateInputValue, setDateInputValue] = useState('');
  const [whatsappValue, setWhatsappValue] = useState('');
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ProfileData>({
    defaultValues: {
      nome_completo: '',
      whatsapp: '',
      aniversario: undefined
    }
  });

  // Load user data when dialog opens
  useEffect(() => {
    if (userData && isOpen) {
      setValue('nome_completo', userData.nome_completo || '');
      
      // Format whatsapp with mask
      const formattedWhatsapp = userData.whatsapp ? formatPhoneNumber(userData.whatsapp) : '';
      setWhatsappValue(formattedWhatsapp);
      
      // Process birthday date if it exists
      if (userData.aniversario) {
        try {
          let formattedDate = '';
          if (typeof userData.aniversario === 'string') {
            // Format date string to DD/MM/YYYY
            const dateObj = new Date(userData.aniversario);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = formatDateToString(dateObj);
            }
          } else if (userData.aniversario instanceof Date) {
            // Already a Date object
            formattedDate = formatDateToString(userData.aniversario);
          }
          
          setDateInputValue(formattedDate);
        } catch (error) {
          console.error('Error processing date:', error);
          setDateInputValue('');
        }
      } else {
        setDateInputValue('');
      }

      // Fields that user cannot edit
      setValue('cargo_id', userData.cargo_id);
      setValue('coordenacao_id', userData.coordenacao_id);
      setValue('supervisao_tecnica_id', userData.supervisao_tecnica_id);
    }
  }, [userData, setValue, isOpen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatDateInput(value);
    setDateInputValue(formattedValue);
  };
  
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setWhatsappValue(formattedValue);
  };

  const onSubmit = async (data: ProfileData) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não identificado. Por favor, faça login novamente.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Process formatted date to a Date object
      let parsedDate = null;
      let aniversarioISO = null;
      
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
        aniversarioISO = parsedDate.toISOString();
      }
      
      // Clean whatsapp input (remove mask)
      const cleanWhatsapp = whatsappValue.replace(/\D/g, '');
      
      // Data for update with correct types
      const updateData = {
        nome_completo: data.nome_completo,
        whatsapp: cleanWhatsapp || null,
        aniversario: aniversarioISO
      };
      
      console.log('Updating with data:', updateData);
      
      // Update profile - Make sure to use the 'usuarios' table, NOT 'users'
      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      if (refreshUserData) await refreshUserData();
      onClose();
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
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
    setWhatsappValue('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] w-[80%] sm:w-full">
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
              placeholder="(11) 98765-4321"
              value={whatsappValue}
              onChange={handleWhatsappChange}
              maxLength={15}
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
          </div>

          {/* Read-only fields for coordination, supervision and role */}
          {userData?.coordenacao && (
            <div className="space-y-2">
              <Label htmlFor="coordenacao">Coordenação</Label>
              <Input
                id="coordenacao"
                value={userData.coordenacao}
                disabled
                readOnly
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">Este campo só pode ser alterado pelo administrador.</p>
            </div>
          )}

          {userData?.supervisao_tecnica && (
            <div className="space-y-2">
              <Label htmlFor="supervisao_tecnica">Supervisão Técnica</Label>
              <Input
                id="supervisao_tecnica"
                value={userData.supervisao_tecnica}
                disabled
                readOnly
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">Este campo só pode ser alterado pelo administrador.</p>
            </div>
          )}

          {userData?.cargo && (
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={userData.cargo}
                disabled
                readOnly
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">Este campo só pode ser alterado pelo administrador.</p>
            </div>
          )}
          
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
