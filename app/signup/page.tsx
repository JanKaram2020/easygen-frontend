import { AuthForm } from "@/components/auth-form";
import AuthedRedirectToHome from "@/components/authed-redirect-to-home";

export default function SignupPage() {
  return (
    <AuthedRedirectToHome>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AuthForm variant={"signup"} />
        </div>
      </div>
    </AuthedRedirectToHome>
  );
}
