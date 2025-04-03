import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';
import MaskedInput from 'react-text-mask';
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
          whatsapp, 
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
            <MaskedInput
              mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="(11) 91234-5678"
              value={whatsapp}
              disabled={!isEditing.whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <Button size="icon" variant="ghost" onClick={() => toggleEdit('whatsapp')}>
              <Pencil size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <MaskedInput
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="DD/MM/AAAA"
              value={aniversario}
              disabled={!isEditing.aniversario}
              onChange={(e) => setAniversario(e.target.value)}
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
