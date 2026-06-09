const requiredEnv = [
  "NEXT_PUBLIC_APP_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "OPENAI_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

type RequiredEnv = (typeof requiredEnv)[number];

export function readEnv(name: RequiredEnv) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get NEXT_PUBLIC_APP_URL() {
    return readEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/, "");
  },
  get GITHUB_CLIENT_ID() {
    return readEnv("GITHUB_CLIENT_ID");
  },
  get GITHUB_CLIENT_SECRET() {
    return readEnv("GITHUB_CLIENT_SECRET");
  },
  get OPENAI_API_KEY() {
    return readEnv("OPENAI_API_KEY");
  },
  get OPENAI_EMBEDDING_MODEL() {
    return process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
  },
  get OPENAI_SUMMARY_MODEL() {
    return process.env.OPENAI_SUMMARY_MODEL ?? "gpt-4o-mini";
  },
  get ADMIN_EMAILS() {
    return process.env.ADMIN_EMAILS ?? "";
  },
  get SUPABASE_URL() {
    return readEnv("SUPABASE_URL");
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return readEnv("SUPABASE_SERVICE_ROLE_KEY");
  }
};
