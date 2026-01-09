import { Temporal } from "temporal-polyfill";
import * as z from "zod";

import { env } from "@repo/env/server";

const eventSchema = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  allDay: z.boolean().optional(),
});

/**
 * Calculate next Friday from today for dynamic example dates
 */
function getNextFriday(timeZone: string): string {
  const now = Temporal.Now.zonedDateTimeISO(timeZone);
  const currentDayOfWeek = now.dayOfWeek; // 1 = Monday, 7 = Sunday
  const daysUntilFriday = (5 - currentDayOfWeek + 7) % 7 || 7; // 5 = Friday
  const nextFriday = now.add({ days: daysUntilFriday });
  return nextFriday.toPlainDate().toString();
}

export async function POST(req: Request) {
  const { text, timeZone } = await req.json();

  if (!env.GROQ_API_KEY && !env.OPENAI_API_KEY) {
    return new Response("Missing AI API Key (OPENAI_API_KEY or GROQ_API_KEY)", {
      status: 500,
    });
  }

  const nowZoned = Temporal.Now.zonedDateTimeISO(timeZone);
  const now = nowZoned.toString();
  const offset = nowZoned.offset;
  const exampleFriday = getNextFriday(timeZone);

  try {
    let responseText: string;

    if (env.GROQ_API_KEY) {
      // Use Groq's chat completions API directly
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are a JSON calendar event generator. Output ONLY valid JSON with fields: title, start, end, description, location, allDay. Current time: ${now}. Use timezone offset ${offset} for all dates. If no duration specified, assume 1 hour.`,
            },
            {
              role: "user",
              content: "lunch with Sarah next Friday at noon",
            },
            {
              role: "assistant",
              content: `{"title":"Lunch with Sarah","start":"${exampleFriday}T12:00:00${offset}","end":"${exampleFriday}T13:00:00${offset}","description":null,"location":null,"allDay":false}`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Groq API Error:", errorBody);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      responseText = data.choices[0]?.message?.content || "";
    } else {
      // OpenAI fallback
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a JSON calendar event generator. Output ONLY valid JSON with fields: title (string), start (ISO datetime), end (ISO datetime), description (string or null), location (string or null), allDay (boolean). Current time: ${now}. Use timezone offset ${offset} for all dates. If no duration specified, assume 1 hour.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      responseText = data.choices[0]?.message?.content || "";
    }

    console.log("AI Response:", responseText);

    // Try to extract JSON from the response
    let jsonStr = responseText.trim();

    // If wrapped in markdown code block, extract it
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      jsonStr = codeBlockMatch[1].trim();
    }

    // If there's a JSON object in the response, extract it
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);
    const validatedEvent = eventSchema.parse(parsed);

    return Response.json(validatedEvent);
  } catch (error) {
    console.error("AI Parse Error:", error);
    return new Response("Failed to parse event", { status: 500 });
  }
}
