"use client";
import { LogoutButton } from "@/components/auth/logout-button";
import { useProfile } from "@/lib/hooks/use-profile";

export default function DashboardPage() {
  const profile = useProfile();

  console.log("User profile:", profile);

  return (
    <main className="bg-background text-foreground">
      <section className="container flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex max-w-2xl flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="text-lg leading-8 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, unde tempore provident corporis ex, eveniet animi obcaecati voluptatum
            voluptatibus atque aliquid vero facere numquam hic quaerat impedit sequi? Molestiae, quae!
          </p>

          <pre className="w-full overflow-x-auto rounded-lg border bg-muted p-4 text-sm">{JSON.stringify(profile, null, 2)}</pre>
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-left sm:items-start sm:text-left">
          <div className="flex gap-6">
            <LogoutButton />
          </div>
        </div>
      </section>
    </main>
  );
}
