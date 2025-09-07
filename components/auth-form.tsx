"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api, { setAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";

const texts = {
  login: {
    title: "Login to your account",
    description: "Enter your email below to login to your account",
    alt: "Don't have an account? ",
    link: "Sign Up",
    href: "/signup",
    action: "Login",
    success: "Logged in Successfully",
  },
  signup: {
    title: "Register your account",
    description: "Enter your email below to register your account",
    alt: "Already have an account? ",
    link: "Log in",
    href: "/login",
    action: "Sign up",
    success: "Registered Successfully",
  },
} as const;

export function AuthForm({
  className,
  variant,
  ...props
}: { variant: "login" | "signup" } & React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useAuthContext();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await api.post("/auth/" + variant, data);
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      toast.success(texts[variant].success);
      invalidate();
      router.push("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        const message =
          e.response?.data?.message ??
          e.message ??
          "Error Occurred, try again later.";
        toast.error(message);
      }
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{texts[variant].title}</CardTitle>
          <CardDescription>{texts[variant].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              {variant === "signup" ? (
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    minLength={3}
                  />
                </div>
              ) : null}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$"
                  title="Password must be at least 8 characters long, include at least one letter, one number, and one special character."
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {texts[variant].action}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {texts[variant].alt}
              <Link
                href={texts[variant].href}
                className="underline underline-offset-4"
              >
                {texts[variant].link}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
