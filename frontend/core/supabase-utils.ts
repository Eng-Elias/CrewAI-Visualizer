import { createClient, REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { Database } from "./database.types";
import {
  RealtimeChannel,
  SupabaseClient,
  AuthError,
  User,
  Session,
} from "@supabase/supabase-js";
import { PostgrestError } from "@supabase/postgrest-js";

type Tables = Database["public"]["Tables"];
type TableName = keyof Tables;
type TableRow<T extends TableName> = Tables[T]["Row"];

type SupabaseResponse<T> = {
  data: T | null;
  error: Error | PostgrestError | AuthError | null;
};

type RealtimePayload<T extends TableName> = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: TableRow<T> | null;
  old: TableRow<T> | null;
};

export class SupabaseUtils {
  private static instance: SupabaseUtils;
  private client: SupabaseClient<Database>;

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey);
  }

  public static getInstance(): SupabaseUtils {
    if (!SupabaseUtils.instance) {
      SupabaseUtils.instance = new SupabaseUtils();
    }
    return SupabaseUtils.instance;
  }

  public get auth() {
    return this.client.auth;
  }

  public get supabase() {
    return this.client;
  }

  // Authentication methods
  async signIn(
    email: string,
    password: string
  ): Promise<SupabaseResponse<{ user: User | null; session: Session | null }>> {
    try {
      const { data, error } = await this.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data: { user: data.user, session: data.session }, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async signOut(): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await this.auth.signOut();
      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Generic CRUD operations
  async create<T extends TableName>(
    table: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Promise<SupabaseResponse<TableRow<T>>> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { data: result as unknown as TableRow<T>, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async get<T extends TableName>(
    table: T,
    options?: {
      select?: string;
      filters?: Partial<Record<keyof TableRow<T>, unknown>>;
      pagination?: { page: number; pageSize: number };
      orderBy?: { column: keyof TableRow<T>; ascending?: boolean };
    }
  ): Promise<SupabaseResponse<TableRow<T>[]>> {
    try {
      let query = this.client.from(table).select(options?.select || "*");

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query = query.eq(key, value as any);
          }
        });
      }

      // Apply pagination
      if (options?.pagination) {
        const { page, pageSize } = options.pagination;
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);
      }

      // Apply ordering
      if (options?.orderBy) {
        const { column, ascending = true } = options.orderBy;
        query = query.order(column as string, { ascending });
      }

      const { data: result, error } = await query;

      if (error) throw error;
      return { data: result as unknown as TableRow<T>[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update<T extends TableName>(
    table: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Promise<SupabaseResponse<TableRow<T>>> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: result as unknown as TableRow<T>, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete<T extends TableName>(
    table: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any
  ): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await this.client.from(table).delete().eq("id", id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Real-time subscriptions
  subscribeToChanges<T extends TableName>(
    table: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (payload: any) => void,
    event: "INSERT" | "UPDATE" | "DELETE" | "*" = "*"
  ): RealtimeChannel {
    const channel = this.client.channel(`${table}_changes`);
    return channel
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES as "system",
        { event, schema: "public", table } as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const typedPayload: RealtimePayload<T> = {
            eventType: payload.eventType,
            new: payload.new as unknown as TableRow<T> | null,
            old: payload.old as unknown as TableRow<T> | null,
          };
          callback(typedPayload);
        }
      )
      .subscribe();
  }

  // Storage operations
  async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<SupabaseResponse<{ path: string }>> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file);
      if (error) throw error;
      return { data: data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteFile(
    bucket: string,
    path: string
  ): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await this.client.storage.from(bucket).remove([path]);
      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  getPublicUrl(bucket: string, path: string): { publicUrl: string } {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data;
  }
}
