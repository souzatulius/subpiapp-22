
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
  } = useForm<UserFormData>();

  const coordenacao = watch('coordenacao_id') || '';
  const { filterSupervisoesByCoordination } = useUserFormLogic(supervisoesTecnicas);
  
  // Filter supervisions based on the selected coordination
  const filteredSupervisoes = React.useMemo(() => 
    filterSupervisoesByCoordination(coordenacao), 
    [coordenacao, supervisoesTecnicas]
  );

  // Reset form when opening or changing user
  React.useEffect(() => {
    if (user && open) {
      reset({
        nome_completo: user.nome_completo,
        email: user.email,
        cargo_id: user.cargo_id || '',
        coordenacao_id: user.coordenacao_id || '',
        supervisao_tecnica_id: user.supervisao_tecnica_id || '',
        whatsapp: user.whatsapp || '',
        aniversario: user.aniversario ? new Date(user.aniversario) : undefined
      });
    } else {
      reset({
        nome_completo: '',
        email: '',
        cargo_id: '',
        coordenacao_id: '',
        supervisao_tecnica_id: '',
        whatsapp: '',
        aniversario: undefined
      });
    }
  }, [user, open, reset]);

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl text-subpi-blue font-semibold">Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
          />
          <DialogFooterActions 
            isSubmitting={isSubmitting} 
            onCancel={() => onOpenChange(false)} 
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
