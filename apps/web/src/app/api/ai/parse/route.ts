import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Temporal } from "temporal-polyfill";
import * as z from "zod";

import { env } from "@repo/env/server";

export async function POST(req: Request) {
  const { text, timeZone } = await req.json();

  let model;

  // Prioritize Groq if available
  if (env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: env.GROQ_API_KEY,
    });
    model = groq("llama-3.3-70b-versatile");
  } else if (env.OPENAI_API_KEY) {
    const openai = createOpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
    model = openai("gpt-4o");
  } else {
    return new Response("Missing AI API Key (OPENAI_API_KEY or GROQ_API_KEY)", {
      status: 500,
    });
  }

  const now = Temporal.Now.zonedDateTimeISO(timeZone).toString();

  try {
    const { object } = await generateObject({
      model,
      schema: z.object({
        title: z.string(),
        start: z.string().describe("ISO 8601 date string"),
        end: z.string().describe("ISO 8601 date string"),
        description: z.string().optional(),
        location: z.string().optional(),
        allDay: z.boolean().optional(),
      }),
      system: `You are a helpful calendar assistant.
      The current date and time is ${now}.
      Parse the user's natural language input into a calendar event.
      If the duration is not specified, assume 1 hour.
      If the start time is not specified, assume the next logical time slot (e.g. next hour or tomorrow morning 9am if late).
      Return dates in ISO 8601 format with the timezone offset from the context (${timeZone}) if applicable, or absolute time.
      `,
      prompt: text,
    });

    return Response.json(object);
  } catch (error) {
    console.error("AI Parse Error:", error);
    return new Response("Failed to parse event", { status: 500 });
  }
}
