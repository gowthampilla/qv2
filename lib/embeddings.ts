import OpenAI from "openai";
import { env } from "@/lib/env";
import type { Activity, EmbeddedActivity } from "@/lib/types";

export async function createActivityEmbeddings(
  activities: Activity[]
): Promise<EmbeddedActivity[]> {
  if (activities.length === 0) {
    return [];
  }

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  const response = await openai.embeddings.create({
    model: env.OPENAI_EMBEDDING_MODEL,
    input: activities.map((activity) => activity.activityText)
  });

  return activities.map((activity, index) => ({
    ...activity,
    embedding: response.data[index].embedding
  }));
}
