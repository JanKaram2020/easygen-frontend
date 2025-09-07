"use client";
import { useState } from "react";
import api, { clearAccessToken } from "@/lib/api";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { data, loading, invalidate } = useAuthContext();

  const [logoutLoading, setLogoutLoading] = useState(false);

  const onClick = async () => {
    if (data?.name) {
      setLogoutLoading(true);
      try {
        await api.post("/auth/logout");
        invalidate();
        clearAccessToken();
        router.push("/login");
      } catch (e) {
        console.log("e", e);
      } finally {
        setLogoutLoading(false);
      }
      return;
    }
    router.push("/login");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {logoutLoading || loading ? (
        <Spinner />
      ) : (
        <div className="flex w-full items-center justify-center flex-col gap-6">
          <h1 className={"text-5xl"}>
            Welcome to the application {data?.name ? ", " + data?.name : ""}
          </h1>
          <Button size={"lg"} onClick={onClick}>
            {data?.name ? "Logout" : "Login"}
          </Button>
        </div>
      )}
    </div>
  );
}
