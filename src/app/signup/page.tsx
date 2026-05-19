import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignupForm from "@/common/components/auth/SignupForm";
import { getSessionFromCookies } from "@/lib/auth";

interface SignupPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const session = getSessionFromCookies(await cookies());
  const { next } = await searchParams;

  if (session) {
    redirect(next || "/recipes");
  }

  return <SignupForm />;
}
