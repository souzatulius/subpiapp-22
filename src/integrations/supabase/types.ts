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
          coordenacao: string | null
          coordenacao_id: string | null
          criado_em: string | null
          descricao: string
          id: string
          is_supervision: boolean | null
          sigla: string | null
        }
        Insert: {
          coordenacao?: string | null
          coordenacao_id?: string | null
          criado_em?: string | null
          descricao: string
          id?: string
          is_supervision?: boolean | null
          sigla?: string | null
        }
        Update: {
          coordenacao?: string | null
          coordenacao_id?: string | null
          criado_em?: string | null
          descricao?: string
          id?: string
          is_supervision?: boolean | null
          sigla?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "areas_coordenacao_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_department_dashboard: {
        Row: {
          cards_config: string | null
          created_at: string | null
          department: string | null
          id: string | null
          updated_at: string | null
          updated_by: string | null
          view_type: string | null
        }
        Insert: {
          cards_config?: string | null
          created_at?: string | null
          department?: string | null
          id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string | null
        }
        Update: {
          cards_config?: string | null
          created_at?: string | null
          department?: string | null
          id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string | null
        }
        Relationships: []
      }
      backup_department_dashboard_comunicacao: {
        Row: {
          cards_config: string | null
          created_at: string | null
          department: string | null
          id: string | null
          updated_at: string | null
          updated_by: string | null
          view_type: string | null
        }
        Insert: {
          cards_config?: string | null
          created_at?: string | null
          department?: string | null
          id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string | null
        }
        Update: {
          cards_config?: string | null
          created_at?: string | null
          department?: string | null
          id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string | null
        }
        Relationships: []
      }
      backup_user_dashboard: {
        Row: {
          cards_config: string | null
          created_at: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_user_dashboard_april11: {
        Row: {
          cards_config: string | null
          created_at: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_user_dashboard_comunicacao: {
        Row: {
          cards_config: string | null
          created_at: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_user_dashboard_comunicacao_april11: {
        Row: {
          cards_config: string | null
          created_at: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_config?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      comunicacoes_oficiais: {
        Row: {
          aprovador_id: string | null
          atualizado_em: string
          autor_id: string
          criado_em: string
          demanda_id: string | null
          id: string
          problema_id: string
          status: string
          texto: string
          titulo: string
        }
        Insert: {
          aprovador_id?: string | null
          atualizado_em?: string
          autor_id: string
          criado_em?: string
          demanda_id?: string | null
          id?: string
          problema_id: string
          status?: string
          texto: string
          titulo: string
        }
        Update: {
          aprovador_id?: string | null
          atualizado_em?: string
          autor_id?: string
          criado_em?: string
          demanda_id?: string | null
          id?: string
          problema_id?: string
          status?: string
          texto?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicacoes_oficiais_area_coordenacao_id_fkey"
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicacoes_oficiais_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicacoes_oficiais_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas_visiveis"
            referencedColumns: ["id"]
          },
        ]
      }
      comunicados: {
        Row: {
          autor_id: string
          coordenacao_id: string | null
          data_envio: string
          destinatarios: string
          id: string
          mensagem: string
          titulo: string
        }
        Insert: {
          autor_id: string
          coordenacao_id?: string | null
          data_envio?: string
          destinatarios: string
          id?: string
          mensagem: string
          titulo: string
        }
        Update: {
          autor_id?: string
          coordenacao_id?: string | null
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
            referencedRelation: "status_usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_notificacoes: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          frequencia: string | null
          id: string
          permite_silenciosa: boolean | null
          prioridade: number | null
          tipo: string
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          frequencia?: string | null
          id?: string
          permite_silenciosa?: boolean | null
          prioridade?: number | null
          tipo: string
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          frequencia?: string | null
          id?: string
          permite_silenciosa?: boolean | null
          prioridade?: number | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      coordenacoes: {
        Row: {
          criado_em: string
          descricao: string
          id: string
          sigla: string | null
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
          sigla?: string | null
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
          sigla?: string | null
        }
        Relationships: []
      }
      demanda_historico: {
        Row: {
          campo_alterado: string
          data_alteracao: string | null
          demanda_id: string
          id: string
          usuario_id: string
          valor_anterior: Json | null
          valor_novo: Json | null
        }
        Insert: {
          campo_alterado: string
          data_alteracao?: string | null
          demanda_id: string
          id?: string
          usuario_id: string
          valor_anterior?: Json | null
          valor_novo?: Json | null
        }
        Update: {
          campo_alterado?: string
          data_alteracao?: string | null
          demanda_id?: string
          id?: string
          usuario_id?: string
          valor_anterior?: Json | null
          valor_novo?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "demanda_historico_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demanda_historico_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas_visiveis"
            referencedColumns: ["id"]
          },
        ]
      }
      demandas: {
        Row: {
          anexos: string[] | null
          arquivo_url: string | null
          atualizado_em: string
          autor_id: string
          bairro_id: string | null
          coordenacao_id: string | null
          detalhes_solicitacao: string | null
          email_solicitante: string | null
          endereco: string | null
          horario_publicacao: string
          id: string
          nao_sabe_servico: boolean | null
          nome_solicitante: string | null
          origem_id: string
          perguntas: Json | null
          prazo_resposta: string
          prioridade: string
          problema_id: string
          protocolo: string | null
          resumo_situacao: string | null
          servico_id: string | null
          status: string
          telefone_solicitante: string | null
          tipo_midia_id: string | null
          titulo: string
          veiculo_imprensa: string | null
        }
        Insert: {
          anexos?: string[] | null
          arquivo_url?: string | null
          atualizado_em?: string
          autor_id: string
          bairro_id?: string | null
          coordenacao_id?: string | null
          detalhes_solicitacao?: string | null
          email_solicitante?: string | null
          endereco?: string | null
          horario_publicacao?: string
          id?: string
          nao_sabe_servico?: boolean | null
          nome_solicitante?: string | null
          origem_id: string
          perguntas?: Json | null
          prazo_resposta: string
          prioridade: string
          problema_id: string
          protocolo?: string | null
          resumo_situacao?: string | null
          servico_id?: string | null
          status: string
          telefone_solicitante?: string | null
          tipo_midia_id?: string | null
          titulo: string
          veiculo_imprensa?: string | null
        }
        Update: {
          anexos?: string[] | null
          arquivo_url?: string | null
          atualizado_em?: string
          autor_id?: string
          bairro_id?: string | null
          coordenacao_id?: string | null
          detalhes_solicitacao?: string | null
          email_solicitante?: string | null
          endereco?: string | null
          horario_publicacao?: string
          id?: string
          nao_sabe_servico?: boolean | null
          nome_solicitante?: string | null
          origem_id?: string
          perguntas?: Json | null
          prazo_resposta?: string
          prioridade?: string
          problema_id?: string
          protocolo?: string | null
          resumo_situacao?: string | null
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
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "status_usuario"
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
            foreignKeyName: "demandas_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
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
      demandas_supervisao_backup: {
        Row: {
          id: string | null
          supervisao_tecnica_id: string | null
        }
        Insert: {
          id?: string | null
          supervisao_tecnica_id?: string | null
        }
        Update: {
          id?: string | null
          supervisao_tecnica_id?: string | null
        }
        Relationships: []
      }
      department_dashboard: {
        Row: {
          cards_config: string
          created_at: string | null
          department: string
          id: string
          updated_at: string | null
          updated_by: string | null
          view_type: string
        }
        Insert: {
          cards_config: string
          created_at?: string | null
          department: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string
        }
        Update: {
          cards_config?: string
          created_at?: string | null
          department?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string
        }
        Relationships: []
      }
      department_dashboard_comunicacao: {
        Row: {
          cards_config: string
          created_at: string | null
          department: string
          id: string
          updated_at: string | null
          updated_by: string | null
          view_type: string
        }
        Insert: {
          cards_config: string
          created_at?: string | null
          department: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string
        }
        Update: {
          cards_config?: string
          created_at?: string | null
          department?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          view_type?: string
        }
        Relationships: []
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
      esic_justificativas: {
        Row: {
          atualizado_em: string
          autor_id: string
          criado_em: string
          gerado_por_ia: boolean
          id: string
          processo_id: string
          texto: string
        }
        Insert: {
          atualizado_em?: string
          autor_id: string
          criado_em?: string
          gerado_por_ia?: boolean
          id?: string
          processo_id: string
          texto: string
        }
        Update: {
          atualizado_em?: string
          autor_id?: string
          criado_em?: string
          gerado_por_ia?: boolean
          id?: string
          processo_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "esic_justificativas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "esic_processos"
            referencedColumns: ["id"]
          },
        ]
      }
      esic_processos: {
        Row: {
          assunto: string
          atualizado_em: string
          autor_id: string
          coordenacao_id: string | null
          criado_em: string
          data_processo: string
          id: string
          prazo_resposta: string | null
          protocolo: string
          situacao: string
          solicitante: string | null
          status: string
          texto: string
        }
        Insert: {
          assunto: string
          atualizado_em?: string
          autor_id: string
          coordenacao_id?: string | null
          criado_em?: string
          data_processo: string
          id?: string
          prazo_resposta?: string | null
          protocolo: string
          situacao: string
          solicitante?: string | null
          status: string
          texto: string
        }
        Update: {
          assunto?: string
          atualizado_em?: string
          autor_id?: string
          coordenacao_id?: string | null
          criado_em?: string
          data_processo?: string
          id?: string
          prazo_resposta?: string | null
          protocolo?: string
          situacao?: string
          solicitante?: string | null
          status?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "esic_processos_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_demandas: {
        Row: {
          coordenacao_id: string | null
          demanda_id: string
          detalhes: Json | null
          evento: string
          id: string
          timestamp: string
          usuario_id: string
        }
        Insert: {
          coordenacao_id?: string | null
          demanda_id: string
          detalhes?: Json | null
          evento: string
          id?: string
          timestamp?: string
          usuario_id: string
        }
        Update: {
          coordenacao_id?: string | null
          demanda_id?: string
          detalhes?: Json | null
          evento?: string
          id?: string
          timestamp?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_demandas_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_demandas_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas_visiveis"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_historico_edicoes: {
        Row: {
          criado_em: string
          editor_id: string
          id: string
          nota_id: string
          texto_anterior: string
          texto_novo: string
          titulo_anterior: string | null
          titulo_novo: string | null
        }
        Insert: {
          criado_em?: string
          editor_id: string
          id?: string
          nota_id: string
          texto_anterior: string
          texto_novo: string
          titulo_anterior?: string | null
          titulo_novo?: string | null
        }
        Update: {
          criado_em?: string
          editor_id?: string
          id?: string
          nota_id?: string
          texto_anterior?: string
          texto_novo?: string
          titulo_anterior?: string | null
          titulo_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_historico_edicoes_nota_id_fkey"
            columns: ["nota_id"]
            isOneToOne: false
            referencedRelation: "notas_oficiais"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_oficiais: {
        Row: {
          aprovador_id: string | null
          atualizado_em: string
          autor_id: string
          coordenacao_id: string | null
          criado_em: string
          demanda_id: string | null
          id: string
          problema_id: string
          status: string
          supervisao_tecnica_id: string | null
          texto: string
          titulo: string
        }
        Insert: {
          aprovador_id?: string | null
          atualizado_em?: string
          autor_id: string
          coordenacao_id?: string | null
          criado_em?: string
          demanda_id?: string | null
          id?: string
          problema_id: string
          status?: string
          supervisao_tecnica_id?: string | null
          texto: string
          titulo: string
        }
        Update: {
          aprovador_id?: string | null
          atualizado_em?: string
          autor_id?: string
          coordenacao_id?: string | null
          criado_em?: string
          demanda_id?: string | null
          id?: string
          problema_id?: string
          status?: string
          supervisao_tecnica_id?: string | null
          texto?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_oficiais_aprovador_id_fkey"
            columns: ["aprovador_id"]
            isOneToOne: false
            referencedRelation: "status_usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_aprovador_id_fkey"
            columns: ["aprovador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_area_coordenacao_id_fkey"
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "status_usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas_visiveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oficiais_supervisao_tecnica_id_fkey"
            columns: ["supervisao_tecnica_id"]
            isOneToOne: false
            referencedRelation: "supervisoes_tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          data_envio: string
          excluida: boolean
          id: string
          lida: boolean
          mensagem: string
          metadados: Json | null
          referencia_id: string | null
          referencia_tipo: string | null
          tipo: string | null
          usuario_id: string
        }
        Insert: {
          data_envio?: string
          excluida?: boolean
          id?: string
          lida?: boolean
          mensagem: string
          metadados?: Json | null
          referencia_id?: string | null
          referencia_tipo?: string | null
          tipo?: string | null
          usuario_id: string
        }
        Update: {
          data_envio?: string
          excluida?: boolean
          id?: string
          lida?: boolean
          mensagem?: string
          metadados?: Json | null
          referencia_id?: string | null
          referencia_tipo?: string | null
          tipo?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "status_usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_156: {
        Row: {
          area_tecnica: string | null
          bairro: string | null
          data_criacao: string | null
          data_status: string | null
          distrito: string | null
          empresa: string | null
          id: string
          logradouro: string | null
          numero_os: string
          servico_valido: boolean | null
          status: string | null
          tempo_aberto: number | null
          tipo_servico: string | null
          upload_id: string | null
        }
        Insert: {
          area_tecnica?: string | null
          bairro?: string | null
          data_criacao?: string | null
          data_status?: string | null
          distrito?: string | null
          empresa?: string | null
          id?: string
          logradouro?: string | null
          numero_os: string
          servico_valido?: boolean | null
          status?: string | null
          tempo_aberto?: number | null
          tipo_servico?: string | null
          upload_id?: string | null
        }
        Update: {
          area_tecnica?: string | null
          bairro?: string | null
          data_criacao?: string | null
          data_status?: string | null
          distrito?: string | null
          empresa?: string | null
          id?: string
          logradouro?: string | null
          numero_os?: string
          servico_valido?: boolean | null
          status?: string | null
          tempo_aberto?: number | null
          tipo_servico?: string | null
          upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_156_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "os_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          area_tecnica: string | null
          bairro: string | null
          cep: string | null
          classificacao_servico: string
          contrato: string | null
          criado_em: string | null
          data_status: string | null
          dias_ate_status_atual: number | null
          distrito: string | null
          fornecedor: string | null
          id: string
          logradouro: string | null
          numero: string | null
          ordem_servico: string
          planilha_referencia: string | null
          prioridade: string | null
          status: string
          subprefeitura: string | null
        }
        Insert: {
          area_tecnica?: string | null
          bairro?: string | null
          cep?: string | null
          classificacao_servico: string
          contrato?: string | null
          criado_em?: string | null
          data_status?: string | null
          dias_ate_status_atual?: number | null
          distrito?: string | null
          fornecedor?: string | null
          id?: string
          logradouro?: string | null
          numero?: string | null
          ordem_servico: string
          planilha_referencia?: string | null
          prioridade?: string | null
          status: string
          subprefeitura?: string | null
        }
        Update: {
          area_tecnica?: string | null
          bairro?: string | null
          cep?: string | null
          classificacao_servico?: string
          contrato?: string | null
          criado_em?: string | null
          data_status?: string | null
          dias_ate_status_atual?: number | null
          distrito?: string | null
          fornecedor?: string | null
          id?: string
          logradouro?: string | null
          numero?: string | null
          ordem_servico?: string
          planilha_referencia?: string | null
          prioridade?: string | null
          status?: string
          subprefeitura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_planilha_referencia_fkey"
            columns: ["planilha_referencia"]
            isOneToOne: false
            referencedRelation: "planilhas_upload"
            referencedColumns: ["id"]
          },
        ]
      }
      origens_demandas: {
        Row: {
          criado_em: string
          descricao: string
          icone: string | null
          id: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          icone?: string | null
          id?: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          icone?: string | null
          id?: string
        }
        Relationships: []
      }
      os_areas_tecnicas: {
        Row: {
          area_tecnica: string
          id: string
          tipo_servico: string
        }
        Insert: {
          area_tecnica: string
          id?: string
          tipo_servico: string
        }
        Update: {
          area_tecnica?: string
          id?: string
          tipo_servico?: string
        }
        Relationships: []
      }
      os_status_historico: {
        Row: {
          data_mudanca: string | null
          id: string
          numero_os: string
          status_anterior: string | null
          status_novo: string
          upload_id: string | null
        }
        Insert: {
          data_mudanca?: string | null
          id?: string
          numero_os: string
          status_anterior?: string | null
          status_novo: string
          upload_id?: string | null
        }
        Update: {
          data_mudanca?: string | null
          id?: string
          numero_os?: string
          status_anterior?: string | null
          status_novo?: string
          upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "os_status_historico_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "os_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      os_uploads: {
        Row: {
          data_upload: string | null
          id: string
          nome_arquivo: string
          processado: boolean | null
          usuario_id: string
        }
        Insert: {
          data_upload?: string | null
          id?: string
          nome_arquivo: string
          processado?: boolean | null
          usuario_id: string
        }
        Update: {
          data_upload?: string | null
          id?: string
          nome_arquivo?: string
          processado?: boolean | null
          usuario_id?: string
        }
        Relationships: []
      }
      paginas_sistema: {
        Row: {
          description: string
          id: string
          name: string
          nivel_acesso: number
        }
        Insert: {
          description: string
          id: string
          name: string
          nivel_acesso?: number
        }
        Update: {
          description?: string
          id?: string
          name?: string
          nivel_acesso?: number
        }
        Relationships: []
      }
      painel_zeladoria: {
        Row: {
          dados: Json | null
          data_upload: string | null
          id: string
          nome_arquivo: string
          processado: boolean | null
          upload_id: string | null
          usuario_id: string
        }
        Insert: {
          dados?: Json | null
          data_upload?: string | null
          id?: string
          nome_arquivo: string
          processado?: boolean | null
          upload_id?: string | null
          usuario_id: string
        }
        Update: {
          dados?: Json | null
          data_upload?: string | null
          id?: string
          nome_arquivo?: string
          processado?: boolean | null
          upload_id?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_upload_id"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "painel_zeladoria_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      painel_zeladoria_comparacoes: {
        Row: {
          created_at: string | null
          id: string
          id_os: string
          motivo: string | null
          status_painel: string | null
          status_sgz: string | null
          upload_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_os: string
          motivo?: string | null
          status_painel?: string | null
          status_sgz?: string | null
          upload_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_os?: string
          motivo?: string | null
          status_painel?: string | null
          status_sgz?: string | null
          upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "painel_zeladoria_comparacoes_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "painel_zeladoria_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      painel_zeladoria_dados: {
        Row: {
          created_at: string | null
          data_abertura: string | null
          data_fechamento: string | null
          departamento: string | null
          distrito: string | null
          id: string
          id_os: string
          responsavel_classificado: string | null
          responsavel_real: string | null
          status: string | null
          tipo_servico: string | null
          upload_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          departamento?: string | null
          distrito?: string | null
          id?: string
          id_os: string
          responsavel_classificado?: string | null
          responsavel_real?: string | null
          status?: string | null
          tipo_servico?: string | null
          upload_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          departamento?: string | null
          distrito?: string | null
          id?: string
          id_os?: string
          responsavel_classificado?: string | null
          responsavel_real?: string | null
          status?: string | null
          tipo_servico?: string | null
          upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "painel_zeladoria_dados_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "painel_zeladoria_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      painel_zeladoria_insights: {
        Row: {
          data_geracao: string | null
          id: string
          indicadores: Json
          painel_id: string
        }
        Insert: {
          data_geracao?: string | null
          id?: string
          indicadores: Json
          painel_id: string
        }
        Update: {
          data_geracao?: string | null
          id?: string
          indicadores?: Json
          painel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "painel_zeladoria_insights_painel_id_fkey"
            columns: ["painel_id"]
            isOneToOne: false
            referencedRelation: "painel_zeladoria"
            referencedColumns: ["id"]
          },
        ]
      }
      painel_zeladoria_uploads: {
        Row: {
          data_upload: string | null
          id: string
          nome_arquivo: string | null
          usuario_email: string | null
        }
        Insert: {
          data_upload?: string | null
          id?: string
          nome_arquivo?: string | null
          usuario_email?: string | null
        }
        Update: {
          data_upload?: string | null
          id?: string
          nome_arquivo?: string | null
          usuario_email?: string | null
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
      permissoes_acesso: {
        Row: {
          coordenacao_id: string | null
          criado_em: string | null
          id: string
          pagina_id: string | null
          supervisao_tecnica_id: string | null
        }
        Insert: {
          coordenacao_id?: string | null
          criado_em?: string | null
          id?: string
          pagina_id?: string | null
          supervisao_tecnica_id?: string | null
        }
        Update: {
          coordenacao_id?: string | null
          criado_em?: string | null
          id?: string
          pagina_id?: string | null
          supervisao_tecnica_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_acesso_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_acesso_pagina_id_fkey"
            columns: ["pagina_id"]
            isOneToOne: false
            referencedRelation: "paginas_sistema"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_acesso_supervisao_tecnica_id_fkey"
            columns: ["supervisao_tecnica_id"]
            isOneToOne: false
            referencedRelation: "supervisoes_tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      planilhas_upload: {
        Row: {
          arquivo_nome: string
          data_upload: string | null
          id: string
          qtd_ordens_processadas: number | null
          qtd_ordens_validas: number | null
          status_upload: string | null
          usuario_upload: string | null
        }
        Insert: {
          arquivo_nome: string
          data_upload?: string | null
          id?: string
          qtd_ordens_processadas?: number | null
          qtd_ordens_validas?: number | null
          status_upload?: string | null
          usuario_upload?: string | null
        }
        Update: {
          arquivo_nome?: string
          data_upload?: string | null
          id?: string
          qtd_ordens_processadas?: number | null
          qtd_ordens_validas?: number | null
          status_upload?: string | null
          usuario_upload?: string | null
        }
        Relationships: []
      }
      prazos_demandas: {
        Row: {
          alterado_por: string
          demanda_id: string
          id: string
          motivo_alteracao: string | null
          prazo_atualizado: string
          prazo_inicial: string
          timestamp_alteracao: string
        }
        Insert: {
          alterado_por: string
          demanda_id: string
          id?: string
          motivo_alteracao?: string | null
          prazo_atualizado: string
          prazo_inicial: string
          timestamp_alteracao?: string
        }
        Update: {
          alterado_por?: string
          demanda_id?: string
          id?: string
          motivo_alteracao?: string | null
          prazo_atualizado?: string
          prazo_inicial?: string
          timestamp_alteracao?: string
        }
        Relationships: [
          {
            foreignKeyName: "prazos_demandas_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prazos_demandas_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas_visiveis"
            referencedColumns: ["id"]
          },
        ]
      }
      problemas: {
        Row: {
          atualizado_em: string | null
          coordenacao_id: string | null
          criado_em: string
          descricao: string
          icone: string | null
          id: string
          supervisao_tecnica_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          coordenacao_id?: string | null
          criado_em?: string
          descricao: string
          icone?: string | null
          id?: string
          supervisao_tecnica_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          coordenacao_id?: string | null
          criado_em?: string
          descricao?: string
          icone?: string | null
          id?: string
          supervisao_tecnica_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problemas_area_coordenacao_id_fkey"
            columns: ["supervisao_tecnica_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problemas_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_ordens_servico: {
        Row: {
          bairro: string | null
          criado_em: string | null
          data_abertura: string | null
          data_conclusao: string | null
          distrito: string | null
          id: string
          numero_os: string
          status: string | null
          tempo_resolucao: number | null
          tipo_servico: string | null
          upload_id: string
        }
        Insert: {
          bairro?: string | null
          criado_em?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          distrito?: string | null
          id?: string
          numero_os: string
          status?: string | null
          tempo_resolucao?: number | null
          tipo_servico?: string | null
          upload_id: string
        }
        Update: {
          bairro?: string | null
          criado_em?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          distrito?: string | null
          id?: string
          numero_os?: string
          status?: string | null
          tempo_resolucao?: number | null
          tipo_servico?: string | null
          upload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_ordens_servico_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "ranking_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_uploads: {
        Row: {
          data_upload: string | null
          id: string
          nome_arquivo: string
          processado: boolean | null
          usuario_id: string
        }
        Insert: {
          data_upload?: string | null
          id?: string
          nome_arquivo: string
          processado?: boolean | null
          usuario_id: string
        }
        Update: {
          data_upload?: string | null
          id?: string
          nome_arquivo?: string
          processado?: boolean | null
          usuario_id?: string
        }
        Relationships: []
      }
      releases: {
        Row: {
          atualizado_em: string
          autor_id: string
          conteudo: string
          criado_em: string
          id: string
          publicada: boolean | null
          release_origem_id: string | null
          status: string | null
          tipo: string
          titulo: string | null
        }
        Insert: {
          atualizado_em?: string
          autor_id: string
          conteudo: string
          criado_em?: string
          id?: string
          publicada?: boolean | null
          release_origem_id?: string | null
          status?: string | null
          tipo: string
          titulo?: string | null
        }
        Update: {
          atualizado_em?: string
          autor_id?: string
          conteudo?: string
          criado_em?: string
          id?: string
          publicada?: boolean | null
          release_origem_id?: string | null
          status?: string | null
          tipo?: string
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "releases_release_origem_id_fkey"
            columns: ["release_origem_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas_demandas: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string
          comentarios: string | null
          criado_em: string
          demanda_id: string
          id: string
          respostas: Json | null
          texto: string
          usuario_id: string
        }
        Insert: {
          arquivo_url?: string | null
          atualizado_em?: string
          comentarios?: string | null
          criado_em?: string
          demanda_id: string
          id?: string
          respostas?: Json | null
          texto: string
          usuario_id: string
        }
        Update: {
          arquivo_url?: string | null
          atualizado_em?: string
          comentarios?: string | null
          criado_em?: string
          demanda_id?: string
          id?: string
          respostas?: Json | null
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
            foreignKeyName: "respostas_demandas_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas_visiveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_demandas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "status_usuario"
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
      roles: {
        Row: {
          descricao: string
          id: number
          role_nome: string
        }
        Insert: {
          descricao: string
          id?: number
          role_nome: string
        }
        Update: {
          descricao?: string
          id?: number
          role_nome?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          criado_em: string
          descricao: string
          id: string
          problema_id: string | null
          supervisao_tecnica_id: string | null
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
          problema_id?: string | null
          supervisao_tecnica_id?: string | null
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
          problema_id?: string | null
          supervisao_tecnica_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_problema_id_fkey"
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_supervisao_tecnica_id_fkey"
            columns: ["supervisao_tecnica_id"]
            isOneToOne: false
            referencedRelation: "areas_coordenacao"
            referencedColumns: ["id"]
          },
        ]
      }
      sgz_departamentos_tecnicos: {
        Row: {
          id: string
          nome: string | null
        }
        Insert: {
          id: string
          nome?: string | null
        }
        Update: {
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      sgz_ordens_servico: {
        Row: {
          id: string
          ordem_servico: string
          planilha_referencia: string | null
          servico_responsavel: string | null
          sgz_bairro: string | null
          sgz_criado_em: string
          sgz_departamento_tecnico: string
          sgz_dias_ate_status_atual: number | null
          sgz_distrito: string
          sgz_empresa: string | null
          sgz_modificado_em: string | null
          sgz_status: string
          sgz_tipo_servico: string
        }
        Insert: {
          id?: string
          ordem_servico: string
          planilha_referencia?: string | null
          servico_responsavel?: string | null
          sgz_bairro?: string | null
          sgz_criado_em: string
          sgz_departamento_tecnico: string
          sgz_dias_ate_status_atual?: number | null
          sgz_distrito: string
          sgz_empresa?: string | null
          sgz_modificado_em?: string | null
          sgz_status: string
          sgz_tipo_servico: string
        }
        Update: {
          id?: string
          ordem_servico?: string
          planilha_referencia?: string | null
          servico_responsavel?: string | null
          sgz_bairro?: string | null
          sgz_criado_em?: string
          sgz_departamento_tecnico?: string
          sgz_dias_ate_status_atual?: number | null
          sgz_distrito?: string
          sgz_empresa?: string | null
          sgz_modificado_em?: string | null
          sgz_status?: string
          sgz_tipo_servico?: string
        }
        Relationships: [
          {
            foreignKeyName: "sgz_ordens_servico_planilha_referencia_fkey"
            columns: ["planilha_referencia"]
            isOneToOne: false
            referencedRelation: "sgz_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sgz_ordens_servico_sgz_departamento_tecnico_fkey"
            columns: ["sgz_departamento_tecnico"]
            isOneToOne: false
            referencedRelation: "sgz_departamentos_tecnicos"
            referencedColumns: ["id"]
          },
        ]
      }
      sgz_status_historico: {
        Row: {
          data_mudanca: string | null
          id: string
          ordem_servico: string
          planilha_origem: string | null
          status_antigo: string | null
          status_novo: string
        }
        Insert: {
          data_mudanca?: string | null
          id?: string
          ordem_servico: string
          planilha_origem?: string | null
          status_antigo?: string | null
          status_novo: string
        }
        Update: {
          data_mudanca?: string | null
          id?: string
          ordem_servico?: string
          planilha_origem?: string | null
          status_antigo?: string | null
          status_novo?: string
        }
        Relationships: [
          {
            foreignKeyName: "sgz_status_historico_planilha_origem_fkey"
            columns: ["planilha_origem"]
            isOneToOne: false
            referencedRelation: "sgz_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      sgz_uploads: {
        Row: {
          data_upload: string | null
          id: string
          nome_arquivo: string
          processado: boolean | null
          usuario_id: string
        }
        Insert: {
          data_upload?: string | null
          id?: string
          nome_arquivo: string
          processado?: boolean | null
          usuario_id: string
        }
        Update: {
          data_upload?: string | null
          id?: string
          nome_arquivo?: string
          processado?: boolean | null
          usuario_id?: string
        }
        Relationships: []
      }
      status_historico: {
        Row: {
          data_mudanca: string | null
          id: string
          ordem_servico: string
          planilha_origem: string | null
          status_antigo: string | null
          status_novo: string
        }
        Insert: {
          data_mudanca?: string | null
          id?: string
          ordem_servico: string
          planilha_origem?: string | null
          status_antigo?: string | null
          status_novo: string
        }
        Update: {
          data_mudanca?: string | null
          id?: string
          ordem_servico?: string
          planilha_origem?: string | null
          status_antigo?: string | null
          status_novo?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_historico_planilha_origem_fkey"
            columns: ["planilha_origem"]
            isOneToOne: false
            referencedRelation: "planilhas_upload"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisoes_tecnicas: {
        Row: {
          coordenacao_id: string | null
          criado_em: string
          descricao: string
          id: string
          sigla: string | null
        }
        Insert: {
          coordenacao_id?: string | null
          criado_em?: string
          descricao: string
          id?: string
          sigla?: string | null
        }
        Update: {
          coordenacao_id?: string | null
          criado_em?: string
          descricao?: string
          id?: string
          sigla?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supervisoes_tecnicas_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_notificacoes: {
        Row: {
          atualizado_em: string | null
          configuracao_id: string | null
          conteudo: string
          criado_em: string | null
          id: string
          tipo_envio: string | null
        }
        Insert: {
          atualizado_em?: string | null
          configuracao_id?: string | null
          conteudo: string
          criado_em?: string | null
          id?: string
          tipo_envio?: string | null
        }
        Update: {
          atualizado_em?: string | null
          configuracao_id?: string | null
          conteudo?: string
          criado_em?: string | null
          id?: string
          tipo_envio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_notificacoes_configuracao_id_fkey"
            columns: ["configuracao_id"]
            isOneToOne: false
            referencedRelation: "configuracoes_notificacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_midia: {
        Row: {
          criado_em: string
          descricao: string
          icone: string | null
          id: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          icone?: string | null
          id?: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          icone?: string | null
          id?: string
        }
        Relationships: []
      }
      tokens_notificacoes: {
        Row: {
          criado_em: string
          fcm_token: string
          id: string
          navegador: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          fcm_token: string
          id?: string
          navegador: string
          user_id: string
        }
        Update: {
          criado_em?: string
          fcm_token?: string
          id?: string
          navegador?: string
          user_id?: string
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
      user_dashboard: {
        Row: {
          cards_config: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cards_config: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cards_config?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_dashboard_comunicacao: {
        Row: {
          cards_config: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cards_config: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cards_config?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
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
            referencedRelation: "status_usuario"
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
      usuario_preferencias: {
        Row: {
          created_at: string | null
          email_notificacoes: boolean | null
          id: string
          notificar_comunicados: boolean | null
          notificar_demandas: boolean | null
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          email_notificacoes?: boolean | null
          id?: string
          notificar_comunicados?: boolean | null
          notificar_demandas?: boolean | null
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          email_notificacoes?: boolean | null
          id?: string
          notificar_comunicados?: boolean | null
          notificar_demandas?: boolean | null
          usuario_id?: string
        }
        Relationships: []
      }
      usuario_roles: {
        Row: {
          coordenacao_id: string | null
          created_at: string
          id: string
          role_id: number
          supervisao_tecnica_id: string | null
          usuario_id: string
        }
        Insert: {
          coordenacao_id?: string | null
          created_at?: string
          id?: string
          role_id: number
          supervisao_tecnica_id?: string | null
          usuario_id: string
        }
        Update: {
          coordenacao_id?: string | null
          created_at?: string
          id?: string
          role_id?: number
          supervisao_tecnica_id?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_roles_coordenacao_id_fkey"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_supervisao_tecnica_id_fkey"
            columns: ["supervisao_tecnica_id"]
            isOneToOne: false
            referencedRelation: "supervisoes_tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          aniversario: string | null
          cargo_id: string | null
          configuracoes_notificacao: Json | null
          coordenacao_id: string | null
          criado_em: string
          email: string
          foto_perfil_url: string | null
          id: string
          nome_completo: string
          status: string | null
          status_conta: string | null
          supervisao_tecnica_id: string | null
          whatsapp: string | null
        }
        Insert: {
          aniversario?: string | null
          cargo_id?: string | null
          configuracoes_notificacao?: Json | null
          coordenacao_id?: string | null
          criado_em?: string
          email: string
          foto_perfil_url?: string | null
          id: string
          nome_completo: string
          status?: string | null
          status_conta?: string | null
          supervisao_tecnica_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          aniversario?: string | null
          cargo_id?: string | null
          configuracoes_notificacao?: Json | null
          coordenacao_id?: string | null
          criado_em?: string
          email?: string
          foto_perfil_url?: string | null
          id?: string
          nome_completo?: string
          status?: string | null
          status_conta?: string | null
          supervisao_tecnica_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_coordenacao_id_fkey1"
            columns: ["coordenacao_id"]
            isOneToOne: false
            referencedRelation: "coordenacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_supervisao_tecnica_id_fkey"
            columns: ["supervisao_tecnica_id"]
            isOneToOne: false
            referencedRelation: "supervisoes_tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      areas_coordenacao_view: {
        Row: {
          coordenacao: string | null
          coordenacao_id: string | null
          criado_em: string | null
          descricao: string | null
          id: string | null
          is_supervision: boolean | null
          sigla: string | null
        }
        Relationships: []
      }
      demandas_visiveis: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string | null
          autor_id: string | null
          autor_nome: string | null
          bairro_id: string | null
          bairro_nome: string | null
          detalhes_solicitacao: string | null
          email_solicitante: string | null
          endereco: string | null
          horario_publicacao: string | null
          id: string | null
          nome_solicitante: string | null
          origem_descricao: string | null
          origem_id: string | null
          perguntas: Json | null
          prazo_resposta: string | null
          prioridade: string | null
          problema_descricao: string | null
          problema_id: string | null
          protocolo: string | null
          status: string | null
          telefone_solicitante: string | null
          tipo_midia_descricao: string | null
          tipo_midia_id: string | null
          titulo: string | null
          veiculo_imprensa: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demandas_area_coordenacao_id_fkey"
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandas_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "status_usuario"
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
            foreignKeyName: "demandas_tipo_midia_id_fkey"
            columns: ["tipo_midia_id"]
            isOneToOne: false
            referencedRelation: "tipos_midia"
            referencedColumns: ["id"]
          },
        ]
      }
      status_usuario: {
        Row: {
          id: string | null
          nome_completo: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_approve_notes: {
        Args: { note_id: string; new_status: string; user_id: string }
        Returns: boolean
      }
      classify_service_responsibility: {
        Args: { service_type: string }
        Returns: string
      }
      clean_zeladoria_data: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_default_permissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_painel_upload_with_data: {
        Args: { p_usuario_email: string; p_nome_arquivo: string; p_dados: Json }
        Returns: Json
      }
      create_permissions_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_area_coordenacao: {
        Args: { p_id: string }
        Returns: boolean
      }
      delete_cargo: {
        Args: { p_id: string }
        Returns: boolean
      }
      delete_origem_demanda: {
        Args: { p_id: string }
        Returns: boolean
      }
      delete_servico: {
        Args: { p_id: string }
        Returns: boolean
      }
      delete_tipo_midia: {
        Args: { p_id: string }
        Returns: boolean
      }
      ensure_sgz_department_exists: {
        Args: { department_name: string }
        Returns: string
      }
      enviar_notificacao: {
        Args: {
          p_usuario_id: string
          p_mensagem: string
          p_tipo?: string
          p_referencia_id?: string
          p_referencia_tipo?: string
          p_metadados?: Json
        }
        Returns: string
      }
      get_demandas_por_origem: {
        Args: Record<PropertyKey, never>
        Returns: {
          origem_id: string
          count: number
        }[]
      }
      get_demandas_por_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
        }[]
      }
      get_notificacoes_por_coordenacao: {
        Args: Record<PropertyKey, never>
        Returns: {
          coordenacao_id: string
          count: number
        }[]
      }
      get_unique_coordenacoes: {
        Args: Record<PropertyKey, never>
        Returns: {
          coordenacao_id: string
          coordenacao: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id?: string }
        Returns: {
          role_nome: string
          descricao: string
          coordenacao_id: string
          coordenacao_nome: string
          supervisao_tecnica_id: string
          supervisao_tecnica_nome: string
        }[]
      }
      insert_area_coordenacao: {
        Args: { p_descricao: string }
        Returns: string
      }
      insert_cargo: {
        Args: { p_descricao: string }
        Returns: string
      }
      insert_origem_demanda: {
        Args: { p_descricao: string }
        Returns: string
      }
      insert_servico: {
        Args: { p_descricao: string; p_area_coordenacao_id: string }
        Returns: string
      }
      insert_supervision_with_coordination: {
        Args:
          | {
              p_descricao: string
              p_sigla: string
              p_coordenacao_id: string
              p_is_supervision?: boolean
            }
          | { p_descricao: string; p_sigla: string; p_coordenacao_id: string }
        Returns: string
      }
      insert_tipo_midia: {
        Args: { p_descricao: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_by_coordenacao: {
        Args: { user_id: string }
        Returns: boolean
      }
      processar_upload_os_156: {
        Args: { upload_id: string }
        Returns: undefined
      }
      respostas_atrasadas_por_coordenacao: {
        Args: { p_coordenacao_id: string }
        Returns: {
          id: string
          titulo: string
          prazo_resposta: string
        }[]
      }
      sgz_map_service_to_area: {
        Args: { service_type: string }
        Returns: string
      }
      update_area_coordenacao: {
        Args: { p_id: string; p_descricao: string }
        Returns: boolean
      }
      update_cargo: {
        Args: { p_id: string; p_descricao: string }
        Returns: boolean
      }
      update_origem_demanda: {
        Args: { p_id: string; p_descricao: string }
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
        Args: { p_id: string; p_descricao: string }
        Returns: boolean
      }
      user_belongs_to_demanda_coordenacao: {
        Args: { user_id: string; demanda_id: string }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          _user_id: string
          _role_nome: string
          _coordenacao_id?: string
          _supervisao_tecnica_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      demanda_status_enum:
        | "pendente"
        | "em_andamento"
        | "aguardando_nota"
        | "nota_em_revisao"
        | "nota_aprovada"
        | "nota_rejeitada"
        | "encerrada"
        | "oculta"
      nota_status_enum: "pendente" | "aprovada" | "rejeitada" | "excluida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      demanda_status_enum: [
        "pendente",
        "em_andamento",
        "aguardando_nota",
        "nota_em_revisao",
        "nota_aprovada",
        "nota_rejeitada",
        "encerrada",
        "oculta",
      ],
      nota_status_enum: ["pendente", "aprovada", "rejeitada", "excluida"],
    },
  },
} as const
