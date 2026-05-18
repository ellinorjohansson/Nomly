import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/common/components/auth/LoginForm";
import { getSessionFromCookies } from "@/lib/auth";

export default async function LoginPage() {
  const session = getSessionFromCookies(await cookies());

  if (session) {
    redirect("/recipes");
  }

  return <LoginForm />;
}
