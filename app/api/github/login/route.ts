import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = crypto.randomUUID();
  const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/github/callback`;
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state
  });

  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );

  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NEXT_PUBLIC_APP_URL.startsWith("https://"),
    maxAge: 10 * 60,
    path: "/"
  });

  return response;
}
