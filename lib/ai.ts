import OpenAI from "openai";
import { env } from "@/lib/env";

function fallbackMemorySentence(text: string) {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return "Added a professional development update to career memory.";
  }

  const withoutPrefix = cleaned
    .replace(/^Committed to ([^:]+):\s*/i, "Improved $1 by ")
    .replace(/^Created or maintained public GitHub repository\s+/i, "Built and maintained ");

  return withoutPrefix.endsWith(".") ? withoutPrefix : `${withoutPrefix}.`;
}

export async function createMemorySentence(input: {
  rawText: string;
  repoName?: string | null;
  activityType?: string | null;
}) {
  try {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const response = await withTimeout(
      openai.chat.completions.create({
        model: env.OPENAI_SUMMARY_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Convert raw developer activity into one polished career memory sentence. Use active voice, past tense, no markdown, no emojis, under 28 words."
          },
          {
            role: "user",
            content: `Raw: ${input.rawText}\nRepo: ${input.repoName ?? "N/A"}\nType: ${input.activityType ?? "activity"}`
          }
        ]
      }),
      2500
    );

    return (
      response.choices[0]?.message.content?.trim().replace(/^"|"$/g, "") ??
      fallbackMemorySentence(input.rawText)
    );
  } catch {
    return fallbackMemorySentence(input.rawText);
  }
}

export async function createDailyTasks(goal: string) {
  try {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const response = await withTimeout(
      openai.chat.completions.create({
        model: env.OPENAI_SUMMARY_MODEL,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Return exactly 4 JSON objects for daily developer career tasks. Each object has title and description. Keep tasks practical and specific."
          },
          {
            role: "user",
            content: `Goal: ${goal}`
          }
        ],
        response_format: { type: "json_object" }
      }),
      2500
    );

    const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}") as {
      tasks?: { title?: string; description?: string }[];
    };
    const tasks = (parsed.tasks ?? []).slice(0, 4).map((task) => ({
      title: task.title ?? "Make focused progress",
      description: task.description ?? `Spend 30 minutes moving toward: ${goal}.`
    }));

    if (tasks.length === 4) {
      return tasks;
    }
  } catch {
  }

  return fallbackDailyTasks(goal);
}

function fallbackDailyTasks(goal: string) {
  return [
    {
      title: "Ship one visible improvement",
      description: `Build, fix, or document one small item that supports your goal: ${goal}.`
    },
    {
      title: "Practice one core skill",
      description: "Spend 30 minutes on a focused technical exercise and write down what improved."
    },
    {
      title: "Update career memory",
      description: "Add one short progress note about what you learned or built today."
    },
    {
      title: "Review recent work",
      description: "Look at yesterday's code or notes and identify one concrete next step."
    }
  ];
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("OpenAI request timed out")), ms);
    })
  ]);
}
