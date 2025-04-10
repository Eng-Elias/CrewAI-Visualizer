"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { ToastUtils } from "@/utils/ui/toast-utils";
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

      ToastUtils.error(
        `Authentication Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
    [router]
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
        ToastUtils.success("Logged in successfully");
        return true;
      } catch (error) {
        handleAuthError(error);
        return false;
      }
    },
    [checkAuth, handleAuthError]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      try {
        await authApi.signup({ email, password });
        await checkAuth();
        ToastUtils.success("Account created successfully");
        return true;
      } catch (error) {
        handleAuthError(error);
        return false;
      }
    },
    [checkAuth, handleAuthError]
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
      ToastUtils.success("Logged out successfully");
    } catch (error) {
      handleAuthError(error);
    }
  }, [router, handleAuthError]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        const updatedUser = await authApi.updateProfile(updates);
        setState((prev) => ({
          ...prev,
          user: updatedUser,
        }));
        ToastUtils.success("Profile updated successfully");
      } catch (error) {
        handleAuthError(error);
      }
    },
    [handleAuthError]
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
