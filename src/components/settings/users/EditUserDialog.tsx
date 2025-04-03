
import React, { useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { formatDateToString, parseFormattedDate } from '@/lib/inputFormatting';

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

const PROFILE_PHOTOS_BUCKET = 'usuarios';
const PROFILE_PHOTOS_FOLDER = 'fotos_perfil';

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
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  
  const coordenacao = watch('coordenacao_id') || '';
  const { filterSupervisoesByCoordination } = useUserFormLogic(supervisoesTecnicas);
  
  const filteredSupervisoes = React.useMemo(() => 
    filterSupervisoesByCoordination(coordenacao), 
    [coordenacao, supervisoesTecnicas]
  );

  useEffect(() => {
    if (user && open) {
      let parsedAniversario = undefined;
      
      if (user.aniversario) {
        try {
          if (typeof user.aniversario === 'string') {
            const dateObj = new Date(user.aniversario);
            if (!isNaN(dateObj.getTime())) {
              parsedAniversario = dateObj;
            }
          } else if (user.aniversario instanceof Date) {
            parsedAniversario = user.aniversario;
          }
        } catch (error) {
          console.error('Error parsing birthday date:', error);
          parsedAniversario = undefined;
        }
      }
        
      reset({
        nome_completo: user.nome_completo,
        email: user.email,
        cargo_id: user.cargo_id || '',
        coordenacao_id: user.coordenacao_id || '',
        supervisao_tecnica_id: user.supervisao_tecnica_id || '',
        whatsapp: user.whatsapp || '',
        aniversario: parsedAniversario,
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
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("A imagem não pode exceder 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setUploadError("O arquivo deve ser uma imagem");
        return;
      }
      
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: UserFormData) => {
    setUploadError(null);
    
    try {
      if (photoFile && user?.id) {
        const fileExt = photoFile.name.split('.').pop() || 'jpg';
        const filePath = `${PROFILE_PHOTOS_FOLDER}/${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from(PROFILE_PHOTOS_BUCKET)
          .upload(filePath, photoFile, {
            upsert: true,
            cacheControl: '3600'
          });

        if (uploadError) {
          console.error('Error uploading profile photo:', uploadError);
          throw new Error("Erro ao fazer upload da foto: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from(PROFILE_PHOTOS_BUCKET)
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          data.foto_perfil_url = urlData.publicUrl;
        }
      }
      
      await onSubmit(data);
    } catch (error: any) {
      console.error('Error processing form submission:', error);
      setUploadError(error.message || "Ocorreu um erro ao processar o formulário");
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar o formulário",
        variant: "destructive"
      });
    }
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl text-subpi-blue font-semibold">Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="flex flex-row items-center gap-5 py-2">
              <div>
                <Avatar className="h-20 w-20">
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
              </div>
              
              <div className="flex flex-col gap-2">
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
                
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
                
                <p className="text-xs text-gray-500">Tamanho máximo: 5MB</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <input
                id="email"
                type="email"
                {...register('email')}
                disabled
                className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
