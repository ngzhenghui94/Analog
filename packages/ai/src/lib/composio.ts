import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

import { env } from "@repo/env/server";

export const composio = new Proxy(
  {},
  {
    get: (_target, prop) => {
      if (!env.COMPOSIO_API_KEY) {
        throw new Error(
          "COMPOSIO_API_KEY is missing. Please add it to your .env file to use AI integrations.",
        );
      }

      // Initialize lazily or return a singleton if it were possible to re-assign.
      // Since we can't easily re-assign the export, we can't really do a true lazy init of the *same* object reference easily without a wrapper.
      // BUT, we can just instantiate it here if we want, but `new Composio` might be heavy or stateful?
      // Actually, standard pattern:

      const client = new Composio({
        apiKey: env.COMPOSIO_API_KEY,
        provider: new VercelProvider(),
      });

      // @ts-expect-error -- Proxy trap
      const value = client[prop];

      return typeof value === 'function' ? value.bind(client) : value;
    },
  },
) as Composio;
