
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: user?.email || '',
    whatsapp: '', // Changed from 'telefone' to 'whatsapp' to match the database schema
  });

  React.useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome_completo, email, whatsapp') // Changed 'telefone' to 'whatsapp'
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setFormData({
        nome: data?.nome_completo || '',
        email: data?.email || user?.email || '',
        whatsapp: data?.whatsapp || '', // Changed from 'telefone' to 'whatsapp'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do perfil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          nome_completo: formData.nome,
          whatsapp: formData.whatsapp // Changed from 'telefone' to 'whatsapp'
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Seu nome completo"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          value={formData.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          O email não pode ser alterado diretamente. Entre em contato com o suporte caso precise alterar.
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="whatsapp">WhatsApp</Label> {/* Changed from 'telefone' to 'whatsapp' */}
        <Input
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleInputChange}
          placeholder="(11) 98765-4321"
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar alterações
      </Button>
    </form>
  );
};

export default ProfileSettings;
