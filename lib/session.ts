import { cookies } from "next/headers";
import { createHash } from "crypto";
import { env } from "@/lib/env";

export type QuadSession = {
  userId: string;
  email: string | null;
  githubUsername: string | null;
  githubUserId: string | null;
};

const localUserId = "00000000-0000-0000-0000-000000000001";

export function uuidFromStableValue(value: string) {
  const hex = createHash("sha256").update(value).digest("hex").slice(0, 32);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `8${hex.slice(17, 20)}`,
    hex.slice(20, 32)
  ].join("-");
}

export function getSession(): QuadSession {
  const store = cookies();
  return {
    userId: store.get("quad_user_id")?.value ?? localUserId,
    email: store.get("quad_user_email")?.value ?? null,
    githubUsername: store.get("quad_github_username")?.value ?? null,
    githubUserId: store.get("quad_github_user_id")?.value ?? null
  };
}

export function hasStoredSession() {
  const store = cookies();
  return Boolean(
    store.get("quad_user_id")?.value ||
      store.get("quad_user_email")?.value ||
      store.get("quad_github_username")?.value ||
      store.get("quad_github_user_id")?.value
  );
}

export function setSessionCookies(response: Response, session: QuadSession) {
  const secure = env.NEXT_PUBLIC_APP_URL.startsWith("https://");
  const maxAge = 60 * 60 * 24 * 90;
  const cookieResponse = response as Response & {
    cookies?: {
      set: (name: string, value: string, options: Record<string, unknown>) => void;
    };
  };

  cookieResponse.cookies?.set("quad_user_id", session.userId, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge,
    path: "/"
  });
  if (session.email) {
    cookieResponse.cookies?.set("quad_user_email", session.email, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge,
      path: "/"
    });
  }
  if (session.githubUsername) {
    cookieResponse.cookies?.set("quad_github_username", session.githubUsername, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge,
      path: "/"
    });
  }
  if (session.githubUserId) {
    cookieResponse.cookies?.set("quad_github_user_id", session.githubUserId, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge,
      path: "/"
    });
  }
}

export function clearSessionCookies(response: Response) {
  const cookieResponse = response as Response & {
    cookies?: {
      delete: (name: string) => void;
    };
  };

  [
    "quad_user_id",
    "quad_user_email",
    "quad_github_username",
    "quad_github_user_id",
    "github_oauth_state"
  ].forEach((name) => cookieResponse.cookies?.delete(name));
}

export function isAdminEmail(email: string | null) {
  if (!email) {
    return false;
  }

  return env.ADMIN_EMAILS.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
