# Quad V1

Minimal career memory app using Next.js App Router, Supabase, GitHub OAuth, pgvector, and OpenAI.

## Setup

1. Create a GitHub OAuth app with callback URL:

   ```text
   http://localhost:3000/api/github/callback
   ```

2. Copy `.env.example` to `.env.local` and fill in the values.

3. Run the Supabase migrations in order:

   ```text
   supabase/migrations/001_github_activities.sql
   supabase/migrations/002_quad_v1.sql
   supabase/migrations/003_quad_commercial_v1.sql
   ```

4. Seed goals and starter content:

   ```text
   supabase/seed_quad_v1.sql
   ```

5. Add admin emails to `.env.local`:

   ```text
   ADMIN_EMAILS=your@email.com,another@email.com
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` and click **Connect GitHub**. Successful imports redirect to `/dashboard`.

The importer fetches the latest 10 public repositories, the latest 20 commits total across those repositories, creates a clean text activity for each repo and commit, embeds each activity with `text-embedding-3-small`, and stores everything in `public.github_activities`.

## User Pages

- `/` is the commercial Quad landing page.
- `/dashboard` shows goal, streak, GitHub activity, today's tasks, recommended opportunities, career memory, and feed preview.
- `/tasks` shows generated daily tasks from active task templates for the selected goal.
- `/feed` shows curated career/building feed posts for the selected goal.
- `/opportunities` shows active opportunities for the selected goal, with goal-based fallback guidance if none exist.
- `/memory` shows a date-grouped timeline from GitHub and manual progress.
- `/onboarding` lets the user choose one V1 career goal and generates 4 daily tasks.
- `/profile` shows name, selected goal, streak, detected skills, GitHub projects, total memories, and completed tasks.
- `/settings` shows GitHub status, username, and a resync button.

## Admin Pages

Admin access uses `ADMIN_EMAILS`. Connect GitHub with an email included in that list.

- `/admin` shows founder overview.
- `/admin/opportunities` creates, edits, and deletes opportunities.
- `/admin/tasks` creates, edits, and deletes task templates.
- `/admin/feed` creates, edits, and deletes feed posts.

If an activity is missing `memory_sentence`, Quad converts the raw activity into a professional career memory sentence with OpenAI and saves it back to Supabase. If OpenAI is unavailable locally, Quad uses a simple fallback sentence so the UI still works.
