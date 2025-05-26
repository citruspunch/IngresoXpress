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
      department: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      employee: {
        Row: {
          created_at: string
          department: string
          id: string
          name: string
          work_day: string
        }
        Insert: {
          created_at?: string
          department?: string
          id?: string
          name: string
          work_day: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          name?: string
          work_day?: string
        }
        Relationships: [
          {
            foreignKeyName: 'employee_department_fkey'
            columns: ['department']
            isOneToOne: false
            referencedRelation: 'department'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'employee_work_day_fkey'
            columns: ['work_day']
            isOneToOne: false
            referencedRelation: 'work_day'
            referencedColumns: ['id']
          }
        ]
      }
      entry: {
        Row: {
          created_at: string
          employee: string
          id: string
          type: Database['public']['Enums']['entry type']
        }
        Insert: {
          created_at: string
          employee: string
          id?: string
          type: Database['public']['Enums']['entry type']
        }
        Update: {
          created_at?: string
          employee?: string
          id?: string
          type?: Database['public']['Enums']['entry type']
        }
        Relationships: [
          {
            foreignKeyName: 'entry_employee_fkey'
            columns: ['employee']
            isOneToOne: false
            referencedRelation: 'employee'
            referencedColumns: ['id']
          }
        ]
      }
      pass: {
        Row: {
          created_at: string
          date: string
          employee: string
          id: string
          reason: string
          type: Database['public']['Enums']['pass type']
        }
        Insert: {
          created_at?: string
          date: string
          employee: string
          id?: string
          reason?: string
          type: Database['public']['Enums']['pass type']
        }
        Update: {
          created_at?: string
          date?: string
          employee?: string
          id?: string
          reason?: string
          type?: Database['public']['Enums']['pass type']
        }
        Relationships: [
          {
            foreignKeyName: 'pass_employee_fkey'
            columns: ['employee']
            isOneToOne: false
            referencedRelation: 'employee'
            referencedColumns: ['id']
          }
        ]
      }
      work_day: {
        Row: {
          check_in_time: string
          check_out_time: string
          created_at: string
          id: string
          name: string
          working_days: Database['public']['Enums']['day'][]
        }
        Insert: {
          check_in_time: string
          check_out_time: string
          created_at?: string
          id?: string
          name: string
          working_days: Database['public']['Enums']['day'][]
        }
        Update: {
          check_in_time?: string
          check_out_time?: string
          created_at?: string
          id?: string
          name?: string
          working_days?: Database['public']['Enums']['day'][]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      day:
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday'
      'entry type': 'check in' | 'check out'
      'pass type': 'absence' | 'late check in' | 'early check out'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      day: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
      'entry type': ['check in', 'check out'],
      'pass type': ['absence', 'late check in', 'early check out'],
    },
  },
} as const
