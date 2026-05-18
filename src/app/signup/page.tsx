import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignupForm from "@/common/components/auth/SignupForm";
import { getSessionFromCookies } from "@/lib/auth";

export default async function SignupPage() {
  const session = getSessionFromCookies(await cookies());

  if (session) {
    redirect("/recipes");
  }

  return <SignupForm />;
}
