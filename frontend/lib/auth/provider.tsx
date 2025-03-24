"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "./api";
import { AuthContextType, AuthState, User } from "./types";
import { handleAuthError, isAuthError } from "./utils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthError = useCallback(
    (error: unknown) => {
      console.error("Auth error:", error);
      
      if (isAuthError(error)) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        router.push("/auth");
      }

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    },
    [router, toast]
  );

  const checkAuth = useCallback(async () => {
    try {
      const user = await authApi.getCurrentUser();
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error) {
      handleAuthError(error);
    }
  }, [handleAuthError]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await authApi.login({ email, password });
        await checkAuth();
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        return true;
      } catch (error) {
        handleAuthError(error);
        return false;
      }
    },
    [checkAuth, handleAuthError, toast]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      try {
        await authApi.signup({ email, password });
        await checkAuth();
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        return true;
      } catch (error) {
        handleAuthError(error);
        return false;
      }
    },
    [checkAuth, handleAuthError, toast]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push("/auth");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      handleAuthError(error);
    }
  }, [router, handleAuthError, toast]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        const updatedUser = await authApi.updateProfile(updates);
        setState((prev) => ({
          ...prev,
          user: updatedUser,
        }));
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } catch (error) {
        handleAuthError(error);
      }
    },
    [handleAuthError, toast]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    const error = new Error("useAuth must be used within an AuthProvider");
    handleAuthError(error);
    throw error;
  }
  return context;
}; 