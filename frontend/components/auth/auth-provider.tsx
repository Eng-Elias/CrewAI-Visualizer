"use client";
import { createContext, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  signOut: () => Promise<void>;
  handleAuthError: (error: unknown) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, checkSession } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthError = useCallback(
    async (error: unknown) => {
      console.error("Auth error:", error);

      // Handle different types of auth errors
      let errorMessage = "Authentication error occurred";
      if (error instanceof AuthError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Show error toast
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });

      // Sign out and redirect to login
      try {
        await supabase.auth.signOut();
        router.push("/auth");
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
        // Force redirect even if sign out fails
        router.push("/auth");
      }
    },
    [router, supabase.auth, toast]
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      handleAuthError(error);
    }
  }, [router, supabase.auth, handleAuthError]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        router.push("/auth");
      } else if (event === "TOKEN_REFRESHED") {
        // Check if session is still valid after token refresh
        try {
          await checkSession();
        } catch (error) {
          handleAuthError(error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, handleAuthError, checkSession]);

  return (
    <AuthContext.Provider value={{ signOut, handleAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
