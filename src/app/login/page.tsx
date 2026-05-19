import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/common/components/auth/LoginForm";
import { getSessionFromCookies } from "@/lib/auth";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = getSessionFromCookies(await cookies());
  const { next } = await searchParams;

  if (session) {
    redirect(next || "/recipes");
  }

  return <LoginForm />;
}
