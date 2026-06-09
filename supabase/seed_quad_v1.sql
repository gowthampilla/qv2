insert into public.goals (name, slug, description)
values
  ('AI Internship', 'ai-internship', 'Build proof of AI product thinking, model usage, and applied engineering.'),
  ('Java Backend Job', 'java-backend-job', 'Prepare for backend roles with Java, Spring Boot, APIs, and system design.'),
  ('Full Stack Developer', 'full-stack-developer', 'Build and ship full-stack applications with production-quality workflows.'),
  ('Improve DSA', 'improve-dsa', 'Practice data structures, algorithms, and interview problem solving consistently.'),
  ('Build Startup', 'build-startup', 'Validate, build, and launch useful products with a tight feedback loop.'),
  ('Get Remote Developer Job', 'get-remote-developer-job', 'Build a remote-ready profile with projects, communication, and proof of execution.')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.task_templates (title, description, goal_slug, difficulty, category, points)
values
  ('Build one AI feature demo', 'Create or improve a small feature that uses an AI API and write a short note about the implementation.', 'ai-internship', 'medium', 'build', 15),
  ('Read one applied AI engineering article', 'Summarize one practical lesson you can apply to your next AI project.', 'ai-internship', 'easy', 'learning', 10),
  ('Document an AI project decision', 'Write why you chose a model, prompt, data shape, or evaluation approach.', 'ai-internship', 'easy', 'portfolio', 10),
  ('Practice one AI interview concept', 'Review embeddings, RAG, evals, agents, or prompt design and capture three takeaways.', 'ai-internship', 'medium', 'interview', 15),
  ('Implement one Spring Boot endpoint', 'Build or improve one REST endpoint with validation and a clean response shape.', 'java-backend-job', 'medium', 'build', 15),
  ('Review one backend interview topic', 'Study transactions, indexing, caching, JVM basics, or API design and write notes.', 'java-backend-job', 'medium', 'interview', 15),
  ('Add one backend test', 'Write a unit or integration test for a service, controller, or repository path.', 'java-backend-job', 'easy', 'quality', 10),
  ('Refactor one backend module', 'Improve naming, error handling, or separation of concerns in a small backend area.', 'java-backend-job', 'medium', 'quality', 15),
  ('Ship one full-stack slice', 'Build a small end-to-end feature from database to UI.', 'full-stack-developer', 'medium', 'build', 15),
  ('Improve one UI state', 'Add a loading, empty, error, or success state to make an existing page feel production-ready.', 'full-stack-developer', 'easy', 'frontend', 10),
  ('Write one API contract', 'Document request, response, validation, and failure behavior for one endpoint.', 'full-stack-developer', 'easy', 'backend', 10),
  ('Deploy or verify one project path', 'Run a build, fix warnings, or verify a deployed route end to end.', 'full-stack-developer', 'medium', 'shipping', 15),
  ('Solve two DSA problems', 'Complete two focused problems and write the pattern used for each.', 'improve-dsa', 'medium', 'practice', 15),
  ('Review one DSA pattern', 'Study sliding window, two pointers, graphs, DP, trees, or heaps with one example.', 'improve-dsa', 'easy', 'learning', 10),
  ('Redo one missed problem', 'Re-solve a problem you previously missed without looking at the solution first.', 'improve-dsa', 'medium', 'review', 15),
  ('Write a complexity note', 'For today’s practice, record time complexity, space complexity, and one edge case.', 'improve-dsa', 'easy', 'interview', 10),
  ('Talk to one potential user', 'Ask one target user about their workflow, pain, or current workaround.', 'build-startup', 'medium', 'discovery', 15),
  ('Ship one product improvement', 'Make one change that improves activation, retention, clarity, or user trust.', 'build-startup', 'medium', 'build', 15),
  ('Write one positioning note', 'Clarify who the product is for, what problem it solves, and why now.', 'build-startup', 'easy', 'strategy', 10),
  ('Review one metric', 'Choose one product signal and decide what action it suggests.', 'build-startup', 'easy', 'growth', 10),
  ('Improve one remote-ready artifact', 'Polish a README, case study, demo, or profile section for asynchronous review.', 'get-remote-developer-job', 'easy', 'portfolio', 10),
  ('Apply to one high-signal role', 'Send one tailored application with a short proof-of-work note.', 'get-remote-developer-job', 'medium', 'applications', 15),
  ('Practice async communication', 'Write a concise project update with context, decision, tradeoff, and next step.', 'get-remote-developer-job', 'easy', 'communication', 10),
  ('Ship one public proof point', 'Publish or improve one visible commit, demo, or technical note.', 'get-remote-developer-job', 'medium', 'build', 15)
on conflict do nothing;

insert into public.feed_posts (title, description, goal_slug, content_type, url)
values
  ('AI internship proof-of-work checklist', 'Build a small demo, explain your model choice, and show evaluation thinking.', 'ai-internship', 'roadmap tip', ''),
  ('Backend API reliability habit', 'Treat validation, errors, tests, and logs as part of the feature, not cleanup.', 'java-backend-job', 'roadmap tip', ''),
  ('Full-stack project idea: issue tracker', 'Build auth, CRUD, filters, activity log, and deployment for a compact portfolio project.', 'full-stack-developer', 'project idea', ''),
  ('DSA pattern focus: sliding window', 'Use a fixed or variable window when contiguous ranges matter.', 'improve-dsa', 'learning resource', ''),
  ('Startup validation challenge', 'Before building more, ask five users what they currently do without your product.', 'build-startup', 'challenge', ''),
  ('Remote developer signal', 'Strong remote candidates show writing clarity, ownership, and shipped artifacts.', 'get-remote-developer-job', 'roadmap tip', '')
on conflict do nothing;

insert into public.opportunities (title, company, description, location, type, goal_slug, required_skills, url, source)
values
  ('AI Product Engineering Internship', 'Quad Sample', 'Sample admin-created opportunity for students building AI product demos.', 'Remote', 'Internship', 'ai-internship', array['TypeScript','OpenAI','Next.js'], '', 'Seed'),
  ('Java Backend Developer Practice Track', 'Quad Sample', 'Sample opportunity-style track focused on Java APIs, testing, and backend fundamentals.', 'Remote', 'Practice', 'java-backend-job', array['Java','Spring Boot','SQL'], '', 'Seed'),
  ('Full Stack Builder Fellowship', 'Quad Sample', 'Sample opportunity for builders shipping full-stack projects with strong product polish.', 'Remote', 'Fellowship', 'full-stack-developer', array['React','Next.js','Supabase'], '', 'Seed')
on conflict do nothing;
