export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      areas_coordenacao: {
        Row: {
          criado_em: string
          descricao: string
          id: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      bairros: {
        Row: {
          criado_em: string
          distrito_id: string
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string
          distrito_id: string
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string
          distrito_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "bairros_distrito_id_fkey"
            columns: ["distrito_id"]
            isOneToOne: false
            referencedRelation: "distritos"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          criado_em: string
          descricao: string
          id: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      comunicados: {
        Row: {
          autor_id: string
          data_envio: string
          destinatarios: string
          id: string
          mensagem: string
          titulo: string
        }
        Insert: {
          autor_id: string
          data_envio?: string
          destinatarios: string
          id?: string
          mensagem: string
          titulo: string
        }
        Update: {
          autor_id?: string
          data_envio?: string
          destinatarios?: string
          id?: string
          mensagem?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicados_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      demandas: {
        Row: {
          area_coordenacao_id: string
          arquivo_url: string | null
          atualizado_em: string
          autor_id: string
          bairro_id: string | null
          detalhes_solicitacao: string | null
          email_solicitante: string | null
          endereco: string | null
          horario_publicacao: string
          id: string
          nome_solicitante: string | null
          origem_id: string
          perguntas: Json | null
          prazo_resposta: string
          prioridade: string
          protocolo: string | null
          servico_id: string | null
          status: string
          telefone_solicitante: string | null
          tipo_midia_id: string | null
          titulo: string
          veiculo_imprensa: string | null
        }
        Insert: {
          area_coordenacao_id: string
          arquivo_url?: string | null
          atualizado_em?: string
          autor_id: string
          bairro_id?: string | null
          detalhes_solicitacao?: string | null
          email_solicitante?: string | null
          endereco?: string | null
          horario_publicacao?: string
          id?: string
          nome_solicitante?: string | null
          origem_id: string
          perguntas?: Json | null
          prazo_resposta: string
          prioridade: string
          protocolo?: string | null
          servico_id?: string | null
          status: string
          telefone_solicitante?: string | null
          tipo_midia_id?: string | null
          titulo: string
          veiculo_imprensa?: string | null
        }
        Update: {
          area_coordenacao_id?: string
          arquivo_url?: string | null
          atualizado_em?: string
          autor_id?: string
          bairro_id?: string | null
          detalhes_solicitacao?: string | null
          email_solicitante?: string | null
          endereco?: string | null
          horario_publicacao?: string
          id?: string
          nome_solicitante?: string | null
          origem_id?: string
          perguntas?: Json | null
          prazo_resposta?: string
          prioridade?: string
          protocolo?: string | null
          servico_id?: string | null
          status?: string
          telefone_solicitante?: string | null
          tipo_midia_id?: string | null
          titulo?: string
          veiculo_imprensa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demandas_area_coordenacao_id_fkey"
            columns: ["area_coordenacao_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_origem_id_fkey"
            columns: ["origem_id"]
            isOneToOne: false
            referencedRelation: "origens_demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_tipo_midia_id_fkey"
            columns: ["tipo_midia_id"]
            isOneToOne: false
            referencedRelation: "tipos_midia"
            referencedColumns: ["id"]
          },
        ]
      }
      distritos: {
        Row: {
          criado_em: string
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      notas_oficiais: {
        Row: {
          aprovador_id: string | null
          area_coordenacao_id: string
          atualizado_em: string
          autor_id: string
          criado_em: string
          id: string
          status: string
          texto: string
          titulo: string
        }
        Insert: {
          aprovador_id?: string | null
          area_coordenacao_id: string
          atualizado_em?: string
          autor_id: string
          criado_em?: string
          id?: string
          status?: string
          texto: string
          titulo: string
        }
        Update: {
          aprovador_id?: string | null
          area_coordenacao_id?: string
          atualizado_em?: string
          autor_id?: string
          criado_em?: string
          id?: string
          status?: string
          texto?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_oficiais_aprovador_id_fkey"
            columns: ["aprovador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_area_coordenacao_id_fkey"
            columns: ["area_coordenacao_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          data_envio: string
          id: string
          lida: boolean
          mensagem: string
          tipo: string | null
          usuario_id: string
        }
        Insert: {
          data_envio?: string
          id?: string
          lida?: boolean
          mensagem: string
          tipo?: string | null
          usuario_id: string
        }
        Update: {
          data_envio?: string
          id?: string
          lida?: boolean
          mensagem?: string
          tipo?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          bairro: string | null
          classificacao: string | null
          criado_em: string | null
          dias: number | null
          distrito: string | null
          id: number
          ordem_servico: string
          status: string | null
          ultima_atualizacao: string | null
        }
        Insert: {
          bairro?: string | null
          classificacao?: string | null
          criado_em?: string | null
          dias?: number | null
          distrito?: string | null
          id?: number
          ordem_servico: string
          status?: string | null
          ultima_atualizacao?: string | null
        }
        Update: {
          bairro?: string | null
          classificacao?: string | null
          criado_em?: string | null
          dias?: number | null
          distrito?: string | null
          id?: number
          ordem_servico?: string
          status?: string | null
          ultima_atualizacao?: string | null
        }
        Relationships: []
      }
      origens_demandas: {
        Row: {
          criado_em: string
          descricao: string
          id: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      permissoes: {
        Row: {
          criado_em: string
          descricao: string
          id: string
          nivel_acesso: number
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
          nivel_acesso: number
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
          nivel_acesso?: number
        }
        Relationships: []
      }
      respostas_demandas: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string
          criado_em: string
          demanda_id: string
          id: string
          texto: string
          usuario_id: string
        }
        Insert: {
          arquivo_url?: string | null
          atualizado_em?: string
          criado_em?: string
          demanda_id: string
          id?: string
          texto: string
          usuario_id: string
        }
        Update: {
          arquivo_url?: string | null
          atualizado_em?: string
          criado_em?: string
          demanda_id?: string
          id?: string
          texto?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_demandas_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_demandas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          area_coordenacao_id: string
          criado_em: string
          descricao: string
          id: string
        }
        Insert: {
          area_coordenacao_id: string
          criado_em?: string
          descricao: string
          id?: string
        }
        Update: {
          area_coordenacao_id?: string
          criado_em?: string
          descricao?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicos_area_coordenacao_id_fkey"
            columns: ["area_coordenacao_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_midia: {
        Row: {
          criado_em: string
          descricao: string
          id: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      uploads_ordens_servico: {
        Row: {
          data_upload: string | null
          id: number
          nome_arquivo: string | null
          registros_atualizados: number | null
          registros_inseridos: number | null
          usuario_id: string
        }
        Insert: {
          data_upload?: string | null
          id?: number
          nome_arquivo?: string | null
          registros_atualizados?: number | null
          registros_inseridos?: number | null
          usuario_id: string
        }
        Update: {
          data_upload?: string | null
          id?: number
          nome_arquivo?: string | null
          registros_atualizados?: number | null
          registros_inseridos?: number | null
          usuario_id?: string
        }
        Relationships: []
      }
      usuario_permissoes: {
        Row: {
          criado_em: string
          id: string
          permissao_id: string
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          permissao_id: string
          usuario_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          permissao_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_permissoes_permissao_id_fkey"
            columns: ["permissao_id"]
            isOneToOne: false
            referencedRelation: "permissoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_permissoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          aniversario: string | null
          area_coordenacao_id: string | null
          cargo_id: string | null
          criado_em: string
          email: string
          foto_perfil_url: string | null
          id: string
          nome_completo: string
          whatsapp: string | null
        }
        Insert: {
          aniversario?: string | null
          area_coordenacao_id?: string | null
          cargo_id?: string | null
          criado_em?: string
          email: string
          foto_perfil_url?: string | null
          id: string
          nome_completo: string
          whatsapp?: string | null
        }
        Update: {
          aniversario?: string | null
          area_coordenacao_id?: string | null
          cargo_id?: string | null
          criado_em?: string
          email?: string
          foto_perfil_url?: string | null
          id?: string
          nome_completo?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_area_coordenacao_id_fkey"
            columns: ["area_coordenacao_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_approve_notes: {
        Args: {
          note_id: string
          new_status: string
          user_id: string
        }
        Returns: boolean
      }
      delete_area_coordenacao: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      delete_cargo: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      delete_origem_demanda: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      delete_servico: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      delete_tipo_midia: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      insert_area_coordenacao: {
        Args: {
          p_descricao: string
        }
        Returns: string
      }
      insert_cargo: {
        Args: {
          p_descricao: string
        }
        Returns: string
      }
      insert_origem_demanda: {
        Args: {
          p_descricao: string
        }
        Returns: string
      }
      insert_servico: {
        Args: {
          p_descricao: string
          p_area_coordenacao_id: string
        }
        Returns: string
      }
      insert_tipo_midia: {
        Args: {
          p_descricao: string
        }
        Returns: string
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      update_area_coordenacao: {
        Args: {
          p_id: string
          p_descricao: string
        }
        Returns: boolean
      }
      update_cargo: {
        Args: {
          p_id: string
          p_descricao: string
        }
        Returns: boolean
      }
      update_origem_demanda: {
        Args: {
          p_id: string
          p_descricao: string
        }
        Returns: boolean
      }
      update_servico: {
        Args: {
          p_id: string
          p_descricao: string
          p_area_coordenacao_id: string
        }
        Returns: boolean
      }
      update_tipo_midia: {
        Args: {
          p_id: string
          p_descricao: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
