import { env } from "@repo/env/client";

import { Google, Microsoft } from "@/components/icons";

export const providers = [
  {
    name: "Google",
    icon: Google,
    id: "google" as const,
  },
  ...(env.NEXT_PUBLIC_MICROSOFT_ENABLED
    ? [
        {
          name: "Microsoft",
          icon: Microsoft,
          id: "microsoft" as const,
        },
      ]
    : []),
];

export type ProviderId = "google" | "microsoft";
