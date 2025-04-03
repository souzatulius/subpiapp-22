import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from '@/components/ui/use-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
  refreshUserData?: () => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose,
  userData,
  refreshUserData
}) => {
  const session = useSession();
  const userId = session?.user?.id;

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [aniversario, setAniversario] = useState('');
  const [isEditing, setIsEditing] = useState({
    nome: false,
    whatsapp: false,
    aniversario: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega dados atuais do perfil
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      // If userData prop is provided, use that
      if (userData) {
        setNome(userData.nome_completo || '');
        setWhatsapp(userData.whatsapp || '');
        setAniversario(userData.aniversario || '');
        return;
      }

      // Otherwise fetch from database
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome_completo, whatsapp, aniversario')
        .eq('id', userId)
        .single();

      if (data) {
        setNome(data.nome_completo || '');
        setWhatsapp(data.whatsapp || '');
        setAniversario(data.aniversario || '');
      } else {
        console.error(error);
      }
    };

    if (isOpen) fetchData();
  }, [userId, isOpen, userData]);

  const handleSave = async () => {
    if (!userId) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          nome_completo: nome, 
          whatsapp: formatPhoneNumber(whatsapp), 
          aniversario 
        })
        .eq('id', userId);

      if (error) {
        setError('Erro ao salvar alterações.');
        console.error(error);
      } else {
        // Refresh user data if callback is provided
        if (refreshUserData) {
          await refreshUserData();
        }
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
        
        onClose();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Format phone number with mask
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Apply formatting based on the number of digits
    if (digits.length <= 2) {
      return digits ? `(${digits}` : '';
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  // Manual implementation of masked input for phone number
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setWhatsapp(formattedValue);
  };

  // Manual implementation of masked input for date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) value = value.slice(0, 8);
    
    let formattedValue = '';
    if (value.length <= 2) {
      formattedValue = value;
    } else if (value.length <= 4) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    }
    
    setAniversario(formattedValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90%] sm:w-full">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <Input
              disabled={!isEditing.nome}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
            />
            <Button size="icon" variant="ghost" onClick={() => toggleEdit('nome')}>
              <Pencil size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              className="w-full"
              placeholder="(11) 91234-5678"
              value={whatsapp}
              disabled={!isEditing.whatsapp}
              onChange={handleWhatsappChange}
            />
            <Button size="icon" variant="ghost" onClick={() => toggleEdit('whatsapp')}>
              <Pencil size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              className="w-full"
              placeholder="DD/MM/AAAA"
              value={aniversario}
              disabled={!isEditing.aniversario}
              onChange={handleDateChange}
            />
            <Button size="icon" variant="ghost" onClick={() => toggleEdit('aniversario')}>
              <Pencil size={18} />
            </Button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
