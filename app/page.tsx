"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { LogoutButton } from "@/components/auth/logout-button";

export default function Home() {
  const { loading, firebaseUser, profile } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <section className="container flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex max-w-2xl flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">CoWorking</h1>

          <p className="text-lg leading-8 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, unde tempore provident corporis ex, eveniet animi obcaecati voluptatum
            voluptatibus atque aliquid vero facere numquam hic quaerat impedit sequi? Molestiae, quae!
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-left sm:items-start sm:text-left">
          <div className="flex gap-6">
            {firebaseUser && profile ? (
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <LogoutButton />
              </div>
            ) : (
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/auth/sign-in">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
