
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { format, parse } from 'date-fns';
import { Loader2, Camera } from 'lucide-react';
import { ProfileData, UserProfile } from './types';
import { updateProfile } from '@/services/authService';
import { useAuth } from '@/hooks/useSupabaseAuth';
import AvatarDisplay from './photo/AvatarDisplay';
import ChangePhotoModal from './photo/ChangePhotoModal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: ProfileData | null;
  refreshUserData: () => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  userData, 
  refreshUserData 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    nome_completo: userData?.nome_completo || '',
    whatsapp: userData?.whatsapp || '',
    aniversario: userData?.aniversario || ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Reset form data when modal is opened with new user data
  React.useEffect(() => {
    if (userData) {
      setFormData({
        nome_completo: userData.nome_completo || '',
        whatsapp: userData.whatsapp || '',
        aniversario: userData.aniversario || ''
      });
    }
  }, [userData, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const formatWhatsapp = (value: string) => {
    // Remove non-numeric characters
    let cleaned = value.replace(/\D/g, '');
    
    // Format: (XX) XXXXX-XXXX
    if (cleaned.length > 0) {
      cleaned = cleaned.substring(0, 11); // Limit to 11 digits
      
      if (cleaned.length > 10) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
      } else if (cleaned.length > 6) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
      } else if (cleaned.length > 2) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
      }
      
      return cleaned;
    }
    
    return '';
  };
  
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setFormData(prev => ({ ...prev, whatsapp: formatted }));
    
    // Clear error when field is edited
    if (formErrors.whatsapp) {
      setFormErrors(prev => ({ ...prev, whatsapp: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate nome_completo
    if (!formData.nome_completo || typeof formData.nome_completo === 'string' && formData.nome_completo.trim().length === 0) {
      errors.nome_completo = 'O nome completo é obrigatório';
    }
    
    // Validate aniversario
    if (formData.aniversario) {
      // Only validate if a date is provided
      try {
        if (typeof formData.aniversario === 'string') {
          // Try to parse the date to check if it's valid
          parse(formData.aniversario, 'yyyy-MM-dd', new Date());
        }
      } catch (error) {
        errors.aniversario = 'Data de aniversário inválida';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Helper function to ensure date is in string format
  const formatDateValue = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    
    if (typeof date === 'string') {
      // If already a string, check if it's in the right format
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      
      // Try to parse and format it
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return format(parsedDate, 'yyyy-MM-dd');
        }
      } catch (e) {
        console.error('Error formatting date:', e);
      }
      return '';
    } 
    
    // Handle Date object
    if (date instanceof Date) {
      return format(date, 'yyyy-MM-dd');
    }
    
    return '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não identificado. Faça login novamente.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format aniversario to string format expected by the backend
      const formattedData = {
        ...formData,
        // Ensure aniversario is in the correct string format
        aniversario: formData.aniversario ? 
          (typeof formData.aniversario === 'string' ? 
            formData.aniversario : 
            format(formData.aniversario as Date, 'yyyy-MM-dd')) 
          : null
      };
      
      const { error } = await updateProfile(formattedData, user.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh user data to update the UI
      await refreshUserData();
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso',
        variant: 'success'
      });
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar seu perfil',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openPhotoModal = () => {
    setIsPhotoModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md w-[90%] sm:w-full">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center my-6">
            <div className="relative">
              <AvatarDisplay 
                nome={userData?.nome_completo || ''}
                imageSrc={userData?.foto_perfil_url}
                size="xl"
              />
              <Button 
                size="icon"
                className="absolute bottom-0 right-0 bg-subpi-blue text-white hover:bg-subpi-blue-dark rounded-full h-8 w-8"
                onClick={openPhotoModal}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="nome_completo" className="text-sm font-medium">
                Nome Completo
              </label>
              <Input
                id="nome_completo"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleChange}
                className={formErrors.nome_completo ? "border-red-500" : ""}
              />
              {formErrors.nome_completo && (
                <p className="text-sm text-red-500 mt-1">{formErrors.nome_completo}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <span className="text-xs text-gray-500">Não editável</span>
              </div>
              <Input
                id="email"
                name="email"
                value={(userData as UserProfile)?.email || ''}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cargo" className="text-sm font-medium">Cargo</label>
                <span className="text-xs text-gray-500">Não editável</span>
              </div>
              <Input
                id="cargo"
                name="cargo"
                value={(userData as UserProfile)?.cargo || ''}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="coordenacao" className="text-sm font-medium">Coordenação</label>
                <span className="text-xs text-gray-500">Não editável</span>
              </div>
              <Input
                id="coordenacao"
                name="coordenacao"
                value={(userData as UserProfile)?.coordenacao || ''}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="supervisao_tecnica" className="text-sm font-medium">Supervisão Técnica</label>
                <span className="text-xs text-gray-500">Não editável</span>
              </div>
              <Input
                id="supervisao_tecnica"
                name="supervisao_tecnica"
                value={(userData as UserProfile)?.supervisao_tecnica || ''}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="text-sm font-medium">
                WhatsApp
              </label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleWhatsappChange}
                placeholder="(XX) XXXXX-XXXX"
                className={formErrors.whatsapp ? "border-red-500" : ""}
              />
              {formErrors.whatsapp && (
                <p className="text-sm text-red-500 mt-1">{formErrors.whatsapp}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="aniversario" className="text-sm font-medium">
                Data de Aniversário
              </label>
              <Input
                id="aniversario"
                name="aniversario"
                type="date"
                value={formatDateValue(formData.aniversario)}
                onChange={handleChange}
                className={formErrors.aniversario ? "border-red-500" : ""}
              />
              {formErrors.aniversario && (
                <p className="text-sm text-red-500 mt-1">{formErrors.aniversario}</p>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
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
      
      <ChangePhotoModal 
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          // Refresh user data after changing photo
          refreshUserData();
        }}
      />
    </>
  );
};

export default EditProfileModal;
