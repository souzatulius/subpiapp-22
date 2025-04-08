
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { registerUser } from '@/services/authService';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome_completo: '',
    cargo: '',
    RF: '',
    coordenacao: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.nome_completo) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha pelo menos email e nome completo.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await registerUser(formData);
      
      toast({
        title: 'Solicitação enviada com sucesso',
        description: 'Você receberá um email com instruções para completar seu cadastro quando sua solicitação for aprovada.',
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/register-success');
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      
      toast({
        title: 'Erro ao enviar solicitação',
        description: error.message || 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Solicitar Acesso</h2>
        <p className="mt-2 text-sm text-gray-600">
          Preencha os dados abaixo para solicitar acesso ao sistema
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Institucional</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu.email@prefeitura.sp.gov.br"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input
              id="nome_completo"
              name="nome_completo"
              type="text"
              value={formData.nome_completo}
              onChange={handleChange}
              placeholder="Nome Completo"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              name="cargo"
              type="text"
              value={formData.cargo}
              onChange={handleChange}
              placeholder="Seu cargo ou função"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="RF">Registro Funcional (RF)</Label>
            <Input
              id="RF"
              name="RF"
              type="text"
              value={formData.RF}
              onChange={handleChange}
              placeholder="Seu RF"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="coordenacao">Coordenação</Label>
            <Input
              id="coordenacao"
              name="coordenacao"
              type="text"
              value={formData.coordenacao}
              onChange={handleChange}
              placeholder="Sua coordenação ou setor"
              className="mt-1"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full text-lg" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Solicitar Acesso'
          )}
        </Button>
        
        <div className="text-center text-sm">
          <Link 
            to="/login" 
            className="font-medium text-primary hover:underline"
          >
            Já tem uma conta? Faça login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
