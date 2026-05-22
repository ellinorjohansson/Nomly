import { cookies } from "next/headers";
import ShoppingListManager from "@/common/components/shoppingList/ShoppingListManager";
import { getSessionFromCookies } from "@/lib/auth";

export default async function ShoppingListPage() {
  const session = getSessionFromCookies(await cookies());

  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <ShoppingListManager currentUserId={session?.userId ?? null} />
      </div>
    </main>
  );
}
