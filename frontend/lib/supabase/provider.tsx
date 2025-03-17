"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  SupabaseClient,
  User,
  AuthError,
  Session,
} from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "./client";

interface SupabaseContextType {
  supabase: SupabaseClient;
  user: User | null;
  loading: boolean;
  error: Error | null;
  checkSession: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthError = useCallback(
    (error: Error) => {
      console.log("Session error:", error);
      setError(error);
      setUser(null);

      toast({
        variant: "destructive",
        title: "Session Error",
        description: error.message,
      });

      // Redirect to login
      router.push("/auth");
    },
    [router, toast]
  );

  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        handleAuthError(new AuthError("No active session"));
        return;
      }

      // Verify token is still valid
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      setUser(user);
      setError(null);
    } catch (error) {
      if (error instanceof AuthError || error instanceof Error) {
        handleAuthError(error);
      } else {
        handleAuthError(new Error("Unknown authentication error"));
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Handle auth state changes
  const handleAuthStateChange = useCallback(
    async (event: string, session: Session | null) => {
      try {
        if (event === "SIGNED_IN") {
          if (!session?.user) {
            throw new Error("Invalid session after sign in");
          }
          setUser(session.user);
          setError(null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          router.push("/auth");
        } else if (event === "TOKEN_REFRESHED") {
          if (!session) {
            throw new Error("Session expired during token refresh");
          }
          // Verify session is still valid
          await checkSession();
        }
      } catch (error) {
        if (error instanceof Error) {
          handleAuthError(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [router, handleAuthError, checkSession]
  );

  useEffect(() => {
    // Initial session check
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession, handleAuthStateChange]);

  const value = {
    supabase,
    user,
    loading,
    error,
    checkSession,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
