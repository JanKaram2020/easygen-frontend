import { AuthForm } from "@/components/auth-form";
import LoggedInGuard from "@/components/logged-in-guard";

export default function LoginPage() {
  return (
    <LoggedInGuard>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AuthForm variant={"login"} />
        </div>
      </div>
    </LoggedInGuard>
  );
}
