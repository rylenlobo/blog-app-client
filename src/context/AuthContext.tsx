"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
  useLayoutEffect
} from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  loginError: any;
  registerError: any;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

const queryClient = new QueryClient();

const protectedRoutes = ["create-post", "my-posts"]; // add your protected paths here

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const setUserStorage = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post<LoginResponse>(
          "/auth/login",
          credentials
        );
        const { accessToken, user } = response.data;
        localStorage.setItem("accessToken", accessToken); // ✅ Store token
        setAuthToken(accessToken);
        setUser(user);
        setUserStorage(user);
        router.push("/");
        return response.data;
      } catch (err: any) {
        setError(
          err.response?.data || { message: "An error occurred during login" }
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: { email: string; password: string; name?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post<LoginResponse>("/auth/register", data);
        const { accessToken, user } = response.data;
        localStorage.setItem("accessToken", accessToken); // ✅ Store token
        setAuthToken(accessToken);
        setUser(user);
        setUserStorage(user);
        router.push("/");
        return response.data;
      } catch (err: any) {
        setError(
          err.response?.data || {
            message: "An error occurred during registration"
          }
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("accessToken"); // ✅ Clear token
      setAuthToken(null);
      setUser(null);
      setUserStorage(null);
      setIsLoading(false);
      router.push("/login");
    }
  }, [router]);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (storedUser && token) {
      setAuthToken(token); // ✅ Set auth header
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      setAuthToken(null);
      setUserStorage(null);
      localStorage.removeItem("accessToken");
    }
    setAuthChecked(true); // ✅ Mark auth check complete
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect from protected routes if not authenticated
  useLayoutEffect(() => {
    if (
      authChecked &&
      !user &&
      protectedRoutes.some((route) => pathname?.includes(route))
    ) {
      router.push("/login");
    }
  }, [pathname, user, router, authChecked]);

  const contextValue = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isLoggingIn: isLoading,
      isRegistering: isLoading,
      isLoggingOut: isLoading,
      loginError: error,
      registerError: error
    }),
    [user, login, register, logout, isLoading, error]
  );

  if (!authChecked) return null; // ✅ Avoid rendering until auth is checked

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
