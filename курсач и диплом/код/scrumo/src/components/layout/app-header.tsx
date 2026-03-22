import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <p className="text-sm text-neutral-500">Добро пожаловать</p>
        <h2 className="text-lg font-semibold tracking-tight">
          {session?.user?.name ?? "Пользователь"}
        </h2>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button
          type="submit"
          variant="outline"
          className="rounded-xl"
        >
          Выйти
        </Button>
      </form>
    </header>
  );
}