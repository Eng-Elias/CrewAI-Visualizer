export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Agents: {
        Row: {
          allow_delegation: boolean | null
          backstory: string | null
          created_at: string
          goal: string
          id: number
          is_builtin: boolean | null
          is_template: boolean | null
          llm_config: Json | null
          max_iterations: number | null
          max_rpm: number | null
          memory_enabled: boolean | null
          name: string
          role: string
          template_id: number | null
          template_version: number | null
          tools: Json | null
          updated_at: string | null
          user_id: string | null
          verbose: boolean | null
        }
        Insert: {
          allow_delegation?: boolean | null
          backstory?: string | null
          created_at?: string
          goal: string
          id?: number
          is_builtin?: boolean | null
          is_template?: boolean | null
          llm_config?: Json | null
          max_iterations?: number | null
          max_rpm?: number | null
          memory_enabled?: boolean | null
          name: string
          role: string
          template_id?: number | null
          template_version?: number | null
          tools?: Json | null
          updated_at?: string | null
          user_id?: string | null
          verbose?: boolean | null
        }
        Update: {
          allow_delegation?: boolean | null
          backstory?: string | null
          created_at?: string
          goal?: string
          id?: number
          is_builtin?: boolean | null
          is_template?: boolean | null
          llm_config?: Json | null
          max_iterations?: number | null
          max_rpm?: number | null
          memory_enabled?: boolean | null
          name?: string
          role?: string
          template_id?: number | null
          template_version?: number | null
          tools?: Json | null
          updated_at?: string | null
          user_id?: string | null
          verbose?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "Agents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "Agents"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_agents: {
        Row: {
          agent_id: number
          agent_order: number
          created_at: string
          crew_id: number
          id: string
          role: Database["public"]["Enums"]["agent_role_type"] | null
          updated_at: string
        }
        Insert: {
          agent_id: number
          agent_order: number
          created_at?: string
          crew_id: number
          id?: string
          role?: Database["public"]["Enums"]["agent_role_type"] | null
          updated_at?: string
        }
        Update: {
          agent_id?: number
          agent_order?: number
          created_at?: string
          crew_id?: number
          id?: string
          role?: Database["public"]["Enums"]["agent_role_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "Agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_agents_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "Crews"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_tasks: {
        Row: {
          assigned_agent_id: number | null
          created_at: string
          crew_id: number
          id: string
          task_id: number
          task_order: number
          updated_at: string
        }
        Insert: {
          assigned_agent_id?: number | null
          created_at?: string
          crew_id: number
          id?: string
          task_id: number
          task_order: number
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: number | null
          created_at?: string
          crew_id?: number
          id?: string
          task_id?: number
          task_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_tasks_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "Agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_tasks_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "Crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      Crews: {
        Row: {
          config: Json | null
          created_at: string
          description: string
          embedder: Json | null
          full_output: boolean | null
          function_calling_llm_id: number | null
          id: number
          is_builtin: boolean | null
          is_template: boolean | null
          language: string | null
          manager_agent: number | null
          manager_llm_id: number | null
          max_rpm: number | null
          memory: boolean | null
          memory_config: Json | null
          name: string
          planning: boolean | null
          planning_llm_id: number | null
          process: Database["public"]["Enums"]["process_type"] | null
          template_id: number | null
          template_version: number | null
          updated_at: string | null
          user_id: string | null
          verbose: boolean | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description: string
          embedder?: Json | null
          full_output?: boolean | null
          function_calling_llm_id?: number | null
          id?: number
          is_builtin?: boolean | null
          is_template?: boolean | null
          language?: string | null
          manager_agent?: number | null
          manager_llm_id?: number | null
          max_rpm?: number | null
          memory?: boolean | null
          memory_config?: Json | null
          name: string
          planning?: boolean | null
          planning_llm_id?: number | null
          process?: Database["public"]["Enums"]["process_type"] | null
          template_id?: number | null
          template_version?: number | null
          updated_at?: string | null
          user_id?: string | null
          verbose?: boolean | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string
          embedder?: Json | null
          full_output?: boolean | null
          function_calling_llm_id?: number | null
          id?: number
          is_builtin?: boolean | null
          is_template?: boolean | null
          language?: string | null
          manager_agent?: number | null
          manager_llm_id?: number | null
          max_rpm?: number | null
          memory?: boolean | null
          memory_config?: Json | null
          name?: string
          planning?: boolean | null
          planning_llm_id?: number | null
          process?: Database["public"]["Enums"]["process_type"] | null
          template_id?: number | null
          template_version?: number | null
          updated_at?: string | null
          user_id?: string | null
          verbose?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "Crews_function_calling_llm_id_fkey"
            columns: ["function_calling_llm_id"]
            isOneToOne: false
            referencedRelation: "LLMs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Crews_manager_agent_fkey"
            columns: ["manager_agent"]
            isOneToOne: false
            referencedRelation: "Agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Crews_manager_llm_id_fkey"
            columns: ["manager_llm_id"]
            isOneToOne: false
            referencedRelation: "LLMs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Crews_planning_llm_id_fkey"
            columns: ["planning_llm_id"]
            isOneToOne: false
            referencedRelation: "LLMs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Crews_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "Crews"
            referencedColumns: ["id"]
          },
        ]
      }
      LLMs: {
        Row: {
          api_key: string | null
          config: Json | null
          created_at: string
          id: number
          models: string[] | null
          name: string
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          api_key?: string | null
          config?: Json | null
          created_at?: string
          id?: number
          models?: string[] | null
          name: string
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          api_key?: string | null
          config?: Json | null
          created_at?: string
          id?: number
          models?: string[] | null
          name?: string
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Tasks: {
        Row: {
          agent: number | null
          async_execution: boolean | null
          config: Json | null
          context: number[] | null
          created_at: string
          description: string
          expected_output: string
          id: number
          is_builtin: boolean | null
          is_template: boolean | null
          name: string
          output_json: Json | null
          template_id: number | null
          template_version: number | null
          tools: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent?: number | null
          async_execution?: boolean | null
          config?: Json | null
          context?: number[] | null
          created_at?: string
          description: string
          expected_output: string
          id?: number
          is_builtin?: boolean | null
          is_template?: boolean | null
          name: string
          output_json?: Json | null
          template_id?: number | null
          template_version?: number | null
          tools?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent?: number | null
          async_execution?: boolean | null
          config?: Json | null
          context?: number[] | null
          created_at?: string
          description?: string
          expected_output?: string
          id?: number
          is_builtin?: boolean | null
          is_template?: boolean | null
          name?: string
          output_json?: Json | null
          template_id?: number | null
          template_version?: number | null
          tools?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Tasks_agent_fkey"
            columns: ["agent"]
            isOneToOne: false
            referencedRelation: "Agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "Tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_role_type: "manager" | "worker"
      process_type: "sequential" | "hierarchical"
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

