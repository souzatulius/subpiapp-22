
# Documentação do Sistema de Permissões

Este documento registra a estrutura de permissões implementada no sistema em 27/10/2024, servindo como referência oficial para evitar alterações acidentais no funcionamento do site.

## Visão Geral

O sistema atual implementa uma estrutura simplificada de permissões baseada em coordenações, onde:

- Todos os usuários têm acesso total ao sistema
- As permissões são definidas exclusivamente com base na coordenação à qual o usuário pertence
- As supervisões técnicas e papéis individuais não são utilizados para controle de acesso
- Os usuários podem editar livremente seus próprios dados de perfil, exceto os campos de coordenação, supervisão técnica e cargo

## Componentes Principais

### 1. Página de Controle de Acesso

A página de controle de acesso (`AccessControl.tsx`) exibe uma lista de coordenações e permite definir visualmente quais páginas do sistema cada coordenação pode acessar, através de botões que representam as permissões.

### 2. Estrutura de Dados

#### Tabelas no Banco de Dados

- **paginas_sistema**: Armazena as páginas do sistema, com seus IDs e níveis de acesso
- **permissoes_acesso**: Relaciona coordenações a páginas (permissões)
- **coordenacoes**: Lista de coordenações disponíveis no sistema

#### Interfaces Principais

```typescript
// Coordenacao
interface Coordenacao {
  id: string;
  descricao: string;
  sigla?: string;
}

// Permission
interface Permission {
  id: string;
  name: string;
  description: string;
  nivel_acesso: number;
}

// User
interface User {
  id: string;
  nome_completo: string;
  email: string;
  type: 'coordenacao' | 'supervisao_tecnica' | 'user';
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  whatsapp?: string;
  aniversario?: string;
  coordenacao?: string;
  supervisao_tecnica?: string;
}
```

### 3. Hooks e Lógica de Permissões

#### `useAccessControl.tsx`
Centraliza a lógica de controle de acesso, gerenciando coordenações e suas permissões.

#### `useAccessControlData.ts` 
Responsável por buscar dados de coordenações e permissões do banco.

#### `usePermissionsManagement.ts`
Gerencia a adição e remoção de permissões para coordenações.

#### `usePermissions.ts`
Hook principal que verifica as permissões do usuário:
```typescript
export const usePermissions = (): UsePermissionsReturn => {
  // O sistema atualmente define todos os usuários como admin
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  
  // Implementação simplificada que concede acesso total
  return { 
    isAdmin, 
    userCoordination, 
    userSupervisaoTecnica, 
    isLoading, 
    error,
    loading: isLoading,
    canAccessProtectedRoute: (route: string) => true // Permitir acesso a todas as rotas
  };
};
```

### 4. Proteção de Rotas

O componente `AdminProtectedRoute.tsx` protege as rotas administrativas, mas atualmente está configurado para dar acesso total a todos os usuários:

```typescript
// Simplificando para permitir acesso total a todos os usuários conforme solicitado
setHasAccess(true);
setAccessChecked(true);
```

### 5. Campos de Perfil Restritos

Os campos de coordenação, supervisão técnica e cargo no perfil do usuário são apresentados como somente leitura e não podem ser editados pelo usuário, apenas por administradores.

## Níveis de Acesso

As permissões têm diferentes níveis de acesso (de 10 a 90):

- 10: Acesso básico (consulta)
- 50: Acesso intermediário (criação e modificação)
- 70: Acesso avançado (relatórios)
- 80: Acesso de aprovação
- 90: Acesso administrativo

## Fluxo de Verificação de Permissões

1. O usuário tenta acessar uma rota protegida
2. O sistema verifica se o usuário está autenticado
3. O sistema identifica a coordenação do usuário
4. O sistema verifica se a coordenação tem permissão para acessar a rota
5. Atualmente, o acesso é sempre concedido devido à configuração simplificada

## Implementação Atual da Página de Permissões

A página de Controle de Acesso (`AccessControl.tsx`) consiste em:

1. Uma tabela que lista todas as coordenações
2. Botões para cada permissão possível (páginas do sistema)
3. Funcionalidades de busca e filtragem de coordenações
4. Botões com estados visuais diferentes para indicar se a permissão está ativa ou não

## Alertas de Segurança

⚠️ **IMPORTANTE**: O sistema está atualmente configurado para conceder acesso total a todos os usuários autenticados. Qualquer alteração nesta configuração deve ser feita com extremo cuidado para evitar impactos no funcionamento do sistema.

---

Este documento deve ser consultado antes de qualquer modificação na estrutura de permissões do sistema. Alterações significativas devem ser aprovadas e documentadas adequadamente.
