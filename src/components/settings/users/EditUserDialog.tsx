
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { User, UserFormData, SupervisaoTecnica, Cargo, Coordenacao } from './types';
import UserFormFields from './dialog/UserFormFields';
import DialogFooterActions from './dialog/DialogFooterActions';
import useUserFormLogic from './dialog/useUserFormLogic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  supervisoesTecnicas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes?: Coordenacao[];
  isSubmitting?: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  supervisoesTecnicas,
  cargos,
  coordenacoes = [],
  isSubmitting = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<UserFormData>({
    defaultValues: {
      nome_completo: '',
      email: '',
      cargo_id: '',
      coordenacao_id: '',
      supervisao_tecnica_id: '',
      whatsapp: '',
      aniversario: undefined,
      foto_perfil_url: ''
    }
  });

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  
  const coordenacao = watch('coordenacao_id') || '';
  const { filterSupervisoesByCoordination } = useUserFormLogic(supervisoesTecnicas);
  
  const filteredSupervisoes = React.useMemo(() => 
    filterSupervisoesByCoordination(coordenacao), 
    [coordenacao, supervisoesTecnicas]
  );

  React.useEffect(() => {
    if (user && open) {
      reset({
        nome_completo: user.nome_completo,
        email: user.email,
        cargo_id: user.cargo_id || '',
        coordenacao_id: user.coordenacao_id || '',
        supervisao_tecnica_id: user.supervisao_tecnica_id || '',
        whatsapp: user.whatsapp || '',
        aniversario: user.aniversario ? new Date(user.aniversario) : undefined,
        foto_perfil_url: user.foto_perfil_url || ''
      });
      setPhotoPreview(user.foto_perfil_url || null);
    } else {
      reset({
        nome_completo: '',
        email: '',
        cargo_id: '',
        coordenacao_id: '',
        supervisao_tecnica_id: '',
        whatsapp: '',
        aniversario: undefined,
        foto_perfil_url: ''
      });
      setPhotoPreview(null);
    }
  }, [user, open, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: UserFormData) => {
    if (photoFile) {
      try {
        const fileName = `profile_photos/${user?.id || Date.now()}_${photoFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('users')
          .upload(fileName, photoFile, {
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('users')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          data.foto_perfil_url = urlData.publicUrl;
        }
      } catch (error) {
        console.error('Error uploading profile photo:', error);
      }
    }
    
    await onSubmit(data);
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl text-subpi-blue font-semibold">Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-3 py-2">
              <Avatar className="h-24 w-24">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Preview" />
                ) : user?.foto_perfil_url ? (
                  <AvatarImage src={user.foto_perfil_url} alt={user.nome_completo} />
                ) : (
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {user ? getInitials(user.nome_completo) : 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                    <ImageIcon className="h-4 w-4" />
                    <span>Alterar foto</span>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">O email não pode ser alterado</p>
            </div>
            
            <UserFormFields 
              watch={watch}
              setValue={setValue}
              errors={errors}
              supervisoesTecnicas={supervisoesTecnicas}
              cargos={cargos}
              coordenacoes={coordenacoes}
              register={register}
              filteredSupervisoes={filteredSupervisoes}
              coordenacao={coordenacao}
              showWhatsapp={true}
              showBirthday={true}
            />
            
            <DialogFooterActions 
              isSubmitting={isSubmitting} 
              onCancel={() => onOpenChange(false)} 
            />
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
