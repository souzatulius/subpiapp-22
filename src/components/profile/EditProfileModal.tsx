
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ProfileData } from './types';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const { updateProfile, user, loading } = useAuth();
  
  const [formData, setFormData] = useState<ProfileData>({
    nome_completo: userData?.nome_completo || '',
    whatsapp: userData?.whatsapp || '',
    aniversario: userData?.aniversario || null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nome_completo?.trim()) {
      newErrors.nome_completo = 'O nome é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formato especial para o campo de telefone
    if (name === 'whatsapp') {
      // Remove todos os caracteres não numéricos
      const numbersOnly = value.replace(/\D/g, '');
      
      // Formatar número de telefone
      let formattedValue = numbersOnly;
      if (numbersOnly.length <= 11) {
        if (numbersOnly.length > 2) {
          formattedValue = `(${numbersOnly.substring(0, 2)}) ${numbersOnly.substring(2)}`;
        }
        if (numbersOnly.length > 7) {
          formattedValue = `(${numbersOnly.substring(0, 2)}) ${numbersOnly.substring(2, 7)}-${numbersOnly.substring(7)}`;
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Formato especial para o campo de data de aniversário
    else if (name === 'aniversario') {
      // Remove todos os caracteres não numéricos
      const numbersOnly = value.replace(/\D/g, '');
      
      // Formatar data
      let formattedDate = numbersOnly;
      if (numbersOnly.length > 2) {
        formattedDate = `${numbersOnly.substring(0, 2)}/${numbersOnly.substring(2)}`;
      }
      if (numbersOnly.length > 4) {
        formattedDate = `${numbersOnly.substring(0, 2)}/${numbersOnly.substring(2, 4)}/${numbersOnly.substring(4, 8)}`;
      }
      
      // Limitar ao tamanho máximo da data (10 caracteres: DD/MM/AAAA)
      if (formattedDate.length <= 10) {
        setFormData(prev => ({ 
          ...prev, 
          aniversario: formattedDate.length === 10 ? formattedDate : formattedDate || null
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar o erro do campo que está sendo editado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user?.id) {
      setErrors({ form: 'Usuário não autenticado' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Preparar dados para envio, transformando data para formato ISO
      let formattedData = { ...formData };
      
      // Converter data do formato DD/MM/YYYY para ISO se existir
      if (formData.aniversario && formData.aniversario.length === 10) {
        try {
          // Parse the date from "DD/MM/YYYY" format
          const parsedDate = parse(formData.aniversario, 'dd/MM/yyyy', new Date(), { locale: ptBR });
          
          // Format it as ISO date (YYYY-MM-DD)
          formattedData.aniversario = format(parsedDate, 'yyyy-MM-dd');
          
          console.log(`Converted date from ${formData.aniversario} to ${formattedData.aniversario}`);
        } catch (error) {
          console.error('Erro ao converter data:', error);
          setErrors({ aniversario: 'Formato de data inválido' });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Log the data being submitted
      console.log('Submitting update with data:', formattedData);
      
      const { error } = await updateProfile(formattedData);
      
      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        setErrors({ form: error.message || 'Erro ao atualizar perfil' });
      } else {
        // Atualizar dados no componente pai
        await refreshUserData();
        onClose();
      }
    } catch (error: any) {
      console.error('Exceção ao atualizar perfil:', error);
      setErrors({ form: error.message || 'Erro desconhecido ao atualizar perfil' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Formatar a data antes de exibir, se necessário
  const formatDisplayDate = (dateString: string | null): string => {
    if (!dateString) return '';
    
    // Verificar se a data já está no formato DD/MM/YYYY
    if (dateString.includes('/')) {
      return dateString;
    }
    
    try {
      // Se a data estiver em formato ISO (YYYY-MM-DD), converter para DD/MM/YYYY
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      console.error('Erro ao formatar data para exibição:', e);
      return dateString;
    }
  };

  // Quando o modal abre, atualizar o state com os dados mais recentes
  React.useEffect(() => {
    if (userData) {
      setFormData({
        nome_completo: userData.nome_completo || '',
        whatsapp: userData.whatsapp || '',
        aniversario: userData.aniversario ? formatDisplayDate(userData.aniversario) : null
      });
    }
  }, [userData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome completo</Label>
            <Input 
              id="nome_completo" 
              name="nome_completo" 
              value={formData.nome_completo} 
              onChange={handleChange}
              placeholder="Seu nome completo"
              className={errors.nome_completo ? 'border-red-500' : ''}
            />
            {errors.nome_completo && <p className="text-sm text-red-500">{errors.nome_completo}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input 
              id="whatsapp" 
              name="whatsapp" 
              value={formData.whatsapp || ''} 
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className={errors.whatsapp ? 'border-red-500' : ''}
            />
            {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aniversario">Data de aniversário</Label>
            <Input 
              id="aniversario" 
              name="aniversario" 
              value={formData.aniversario || ''} 
              onChange={handleChange}
              placeholder="DD/MM/AAAA"
              className={errors.aniversario ? 'border-red-500' : ''}
            />
            {errors.aniversario && <p className="text-sm text-red-500">{errors.aniversario}</p>}
          </div>
          
          {errors.form && <p className="text-sm text-red-500 mt-4">{errors.form}</p>}

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
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
