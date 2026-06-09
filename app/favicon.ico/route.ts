export const dynamic = "force-static";

export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#071113"/>
    <path d="M18 34c0-9 6-16 15-16 8 0 14 6 14 14 0 8-6 14-14 14h-3v-9h4c3 0 5-2 5-5s-2-6-6-6c-4 0-7 3-7 8v18h-8V34z" fill="#2dd4bf"/>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
