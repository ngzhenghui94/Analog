import { generateOpenApiDocument } from "trpc-to-openapi";

import { env } from "@repo/env/client";

import { appRouter } from "./root";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Analog API",
  version: "1.0.0",
  baseUrl: env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000",
  securitySchemes: {
    apiKey: {
      type: "apiKey",
      in: "header",
      name: "x-api-key",
    },
  },
});
