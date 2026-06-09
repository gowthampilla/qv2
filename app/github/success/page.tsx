import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-xl">
        {searchParams.error ? (
          <>
            <h1 className="text-3xl font-semibold tracking-normal text-red-300">
              GitHub connection failed
            </h1>
            <p className="mt-4 text-muted-foreground">{searchParams.error}</p>
            <Button asChild className="mt-6">
              <Link href="/">
              Try again
              </Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-normal">
              GitHub connected successfully
            </h1>
            <div className="mt-6 grid gap-3" aria-label="Import results">
              <div className="flex justify-between border-b border-border py-3">
                <span>Repos fetched</span>
                <strong>{repos}</strong>
              </div>
              <div className="flex justify-between border-b border-border py-3">
                <span>Activities stored</span>
                <strong>{activities}</strong>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
