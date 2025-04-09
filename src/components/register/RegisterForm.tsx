import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { SelectOption } from '@/components/register/types';
import EmailSuffix from '@/components/EmailSuffix';
import { registerUser } from '@/services/authService';

interface RegisterFormProps {
  onSuccess?: () => void;
  roles?: SelectOption[];
  areas?: SelectOption[];
  coordenacoes?: SelectOption[];
  loadingOptions?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess,
  roles = [],
  areas = [],
  coordenacoes = [],
  loadingOptions = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome_completo: '',
    cargo: '',
    cargo_id: '',
    RF: '',
    coordenacao: '',
    coordenacao_id: '',
    password: 'temp123456', // Temporary password, will be changed on first login
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
      
      // Build complete email with domain
      const completeEmail = `${formData.email}@smsub.prefeitura.sp.gov.br`;
      
      // Create registration data object
      const registrationData = {
        email: completeEmail,
        nome_completo: formData.nome_completo,
        cargo: formData.cargo,
        cargo_id: formData.cargo_id,
        RF: formData.RF,
        coordenacao: formData.coordenacao,
        coordenacao_id: formData.coordenacao_id,
        password: formData.password
      };
      
      // Call register service
      const result = await registerUser(registrationData);
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: 'Solicitação enviada com sucesso',
        description: 'Você receberá um email com instruções para confirmar seu cadastro.',
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/email-verified');
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

  // Function to get the display text for coordination (sigla or full name)
  const getCoordinationDisplayText = (coord: SelectOption) => {
    // Check if the coord object has a sigla property
    if (coord.sigla && coord.sigla.trim() !== '') {
      return coord.sigla; // Return just the sigla if available
    }
    
    // Otherwise return the full description
    return coord.label || coord.value;
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm">
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
            <EmailSuffix
              id="email"
              value={formData.email}
              onChange={handleEmailChange}
              suffix="@smsub.prefeitura.sp.gov.br"
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
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="cargo">Cargo</Label>
            {loadingOptions ? (
              <Input
                id="cargo"
                name="cargo"
                type="text"
                value="Carregando..."
                disabled
                className="mt-1"
              />
            ) : (
              <Select
                name="cargo_id"
                onValueChange={(value) => handleSelectChange('cargo_id', value)}
                value={formData.cargo_id}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
            {loadingOptions ? (
              <Input
                id="coordenacao"
                name="coordenacao"
                type="text"
                value="Carregando..."
                disabled
                className="mt-1"
              />
            ) : (
              <Select
                name="coordenacao_id"
                onValueChange={(value) => handleSelectChange('coordenacao_id', value)}
                value={formData.coordenacao_id}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione sua coordenação" />
                </SelectTrigger>
                <SelectContent>
                  {coordenacoes.map((coord) => (
                    <SelectItem key={coord.value} value={coord.value}>
                      {getCoordinationDisplayText(coord)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
