
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProfile } from '@/services/authService';
import { Save, X } from 'lucide-react';
import { ProfileData } from '@/components/profile/types';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  userId: string;
  onProfileUpdate: (updatedData: Partial<ProfileData>) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profileData,
  userId,
  onProfileUpdate
}) => {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    nome_completo: profileData.nome_completo || '',
    whatsapp: profileData.whatsapp || '',
    aniversario: profileData.aniversario ? new Date(profileData.aniversario) : undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when profile data changes
  useEffect(() => {
    setFormData({
      nome_completo: profileData.nome_completo || '',
      whatsapp: profileData.whatsapp || '',
      aniversario: profileData.aniversario ? new Date(profileData.aniversario) : undefined
    });
  }, [profileData]);

  // Format date to DD/MM/YYYY for display
  const formatDateToBrazilian = (date: Date | undefined): string => {
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Parse date from DD/MM/YYYY to Date object
  const parseBrazilianDate = (dateString: string): Date | undefined => {
    if (!dateString || !dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) return undefined;
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    const parsedDate = new Date(year, month - 1, day);
    return !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow direct input in DD/MM/YYYY format
    if (!value) {
      setFormData({ ...formData, aniversario: undefined });
      return;
    }
    
    const parsedDate = parseBrazilianDate(value);
    setFormData({ ...formData, aniversario: parsedDate });
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (numericValue.length > 0) {
      if (numericValue.length <= 2) {
        value = `(${numericValue}`;
      } else if (numericValue.length <= 7) {
        value = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2)}`;
      } else {
        value = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7, 11)}`;
      }
    }
    
    setFormData({ ...formData, whatsapp: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await updateProfile(formData, userId);
      
      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      onProfileUpdate(formData);
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível atualizar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações pessoais.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome_completo">Nome completo</Label>
            <Input
              id="nome_completo"
              value={formData.nome_completo}
              onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              required
              className="rounded-lg"
            />
          </div>
          
          {/* Display-only fields */}
          {profileData.cargo && (
            <div className="grid gap-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={typeof profileData.cargo === 'string' ? profileData.cargo : profileData.cargo?.descricao || ''}
                disabled
                className="rounded-lg bg-gray-100"
              />
            </div>
          )}
          
          {profileData.coordenacao && (
            <div className="grid gap-2">
              <Label htmlFor="coordenacao">Coordenação</Label>
              <Input
                id="coordenacao"
                value={typeof profileData.coordenacao === 'string' ? profileData.coordenacao : profileData.coordenacao?.descricao || ''}
                disabled
                className="rounded-lg bg-gray-100"
              />
            </div>
          )}
          
          {profileData.supervisao_tecnica && (
            <div className="grid gap-2">
              <Label htmlFor="supervisao_tecnica">Supervisão Técnica</Label>
              <Input
                id="supervisao_tecnica"
                value={typeof profileData.supervisao_tecnica === 'string' ? profileData.supervisao_tecnica : profileData.supervisao_tecnica?.descricao || ''}
                disabled
                className="rounded-lg bg-gray-100"
              />
            </div>
          )}
          
          {profileData.email && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="rounded-lg bg-gray-100"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={handleWhatsappChange}
              placeholder="(XX) XXXXX-XXXX"
              className="rounded-lg"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="aniversario">Data de nascimento</Label>
            <Input
              id="aniversario"
              value={formData.aniversario ? formatDateToBrazilian(formData.aniversario as Date) : ''}
              onChange={handleDateChange}
              placeholder="DD/MM/AAAA"
              className="rounded-lg"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="gap-2 rounded-lg"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2 rounded-lg"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
