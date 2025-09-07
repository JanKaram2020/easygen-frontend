"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";
import { getAccessToken } from "@/lib/auth-utils";

const useFetchUser = () => {
  const [data, setData] = useState<
    { email: string; name: string } | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null | unknown>(null);

  const fetchUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setData(undefined);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      setData(res.data);
      setError(null);
    } catch (e) {
      setError(e);
      setData(undefined);
      console.log("e", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const invalidate = useCallback(() => {
    setData(undefined);
    fetchUser();
  }, [fetchUser]);

  return {
    data,
    loading,
    error,
    refetch: fetchUser,
    invalidate,
  };
};

const AuthContext = createContext<ReturnType<typeof useFetchUser> | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useFetchUser();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
