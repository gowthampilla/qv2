import Link from "next/link";
import { QuadLogo } from "@/components/app/quad-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SearchParams = {
  repos?: string;
  activities?: string;
  error?: string;
};

export default function GitHubSuccessPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const repos = Number(searchParams.repos ?? 0);
  const activities = Number(searchParams.activities ?? 0);

  return (
    <main className="premium-surface flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-xl">
        <div className="mb-8">
          <QuadLogo />
        </div>
        {searchParams.error ? (
          <Card>
            <CardContent className="p-6">
            <h1 className="text-3xl font-semibold tracking-normal text-red-300">
              GitHub connection failed
            </h1>
            <p className="mt-4 text-[#8A8A8A]">{searchParams.error}</p>
            <Button asChild className="mt-6">
              <Link href="/">
              Try again
              </Link>
            </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel">
            <CardContent className="p-6">
            <h1 className="text-3xl font-semibold tracking-normal text-[#F5F5F5]">
              GitHub connected successfully
            </h1>
            <p className="mt-3 text-sm text-[#C0C0C0]">Quad remembered what you built.</p>
            <div className="mt-6 grid gap-3 text-sm" aria-label="Import results">
              <div className="flex justify-between border-b border-[#2A2A2A] py-3">
                <span className="text-[#8A8A8A]">Repos fetched</span>
                <strong className="text-[#F5F5F5]">{repos}</strong>
              </div>
              <div className="flex justify-between border-b border-[#2A2A2A] py-3">
                <span className="text-[#8A8A8A]">Activities stored</span>
                <strong className="text-[#F5F5F5]">{activities}</strong>
              </div>
            </div>
            <Button asChild className="mt-6">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
