import { supabase } from "@/lib/supabase/client";
import { AuthResponse, User } from "./types";

export const authApi = {
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata.name || "",
      role: session.user.user_metadata.role || "user",
    };
  },

  login: async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signup: async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: updates,
    });
    if (error) throw error;
    if (!user) throw new Error("Failed to update profile");

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name || "",
      role: user.user_metadata.role || "user",
    };
  },
}; 