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
  ('Record a 60-second AI project explanation', 'Explain the problem, your approach, the AI workflow, and the result in clear interview-ready language.', 'ai-internship', 'easy', 'interview', 10),
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
  ('Write a complexity note', 'For today''s practice, record time complexity, space complexity, and one edge case.', 'improve-dsa', 'easy', 'interview', 10),
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
  ('Build an interview-ready AI demo', 'Ship one focused workflow, document the model decision, and prepare a 60-second explanation.', 'ai-internship', 'weekly focus', ''),
  ('Make one backend feature production-ready', 'Add validation, useful errors, a test, and a short API note to one Spring Boot endpoint.', 'java-backend-job', 'weekly focus', ''),
  ('Turn one feature into a portfolio story', 'Show the user problem, implementation decision, final UI, and deployed result.', 'full-stack-developer', 'portfolio tip', ''),
  ('Practice one DSA pattern deeply', 'Solve one new problem, redo one missed problem, and explain the pattern without notes.', 'improve-dsa', 'practice plan', ''),
  ('Run one high-signal user conversation', 'Ask about the current workflow, pain, workaround, and what a useful solution would change.', 'build-startup', 'founder challenge', ''),
  ('Publish one remote-ready work update', 'Write a concise update with context, decision, tradeoff, result, and next step.', 'get-remote-developer-job', 'communication tip', '')
on conflict do nothing;

insert into public.opportunities (title, company, description, location, type, goal_slug, required_skills, url, source)
values
  ('AI Product Intern', 'Early AI Startup', 'Help build, test, and document practical AI product workflows for real users.', 'Remote', 'Internship', 'ai-internship', array['Next.js','OpenAI','GitHub'], '', 'Quad curated'),
  ('Backend Engineering Intern', 'Product Engineering Team', 'Build reliable APIs and improve backend services using Java and Spring Boot.', 'Hybrid', 'Internship', 'java-backend-job', array['Java','Spring Boot','SQL'], '', 'Quad curated'),
  ('Full Stack Developer Intern', 'SaaS Product Studio', 'Ship production-ready features across frontend, backend, and data workflows.', 'Remote', 'Internship', 'full-stack-developer', array['React','Next.js','Supabase'], '', 'Quad curated'),
  ('Software Engineering Interview Program', 'Engineering Talent Network', 'Practice structured problem solving and strengthen technical interview readiness.', 'Online', 'Program', 'improve-dsa', array['DSA','Algorithms','Problem Solving'], '', 'Quad curated'),
  ('Founder Fellowship', 'Early Builder Community', 'Validate a problem, ship an MVP, and learn through direct user feedback.', 'Hybrid', 'Fellowship', 'build-startup', array['Product','Customer Discovery','MVP'], '', 'Quad curated'),
  ('Remote Software Developer', 'Distributed Product Team', 'Contribute to product features with strong ownership and written communication.', 'Remote', 'Entry level', 'get-remote-developer-job', array['GitHub','Communication','Web Development'], '', 'Quad curated')
on conflict do nothing;
