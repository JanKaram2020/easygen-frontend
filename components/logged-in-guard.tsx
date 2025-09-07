"use client";
import React, { ReactNode } from "react";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

const LoggedInGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data, loading } = useAuthContext();

  if (loading) {
    return (
      <div
        className={
          "flex flex-col w-full min-h-dvh items-center justify-center gap-4"
        }
      >
        <Spinner />
      </div>
    );
  }

  if (data?.name) {
    setTimeout(() => {
      router.push("/");
    }, 2000);

    return (
      <div
        className={
          "flex flex-col w-full min-h-dvh items-center justify-center gap-4"
        }
      >
        <h1>You are already logged in, redirecting to home page</h1>
        <Spinner />
      </div>
    );
  }

  return children;
};

export default LoggedInGuard;
