import { GooglePlacesProvider } from "@repo/providers/google-places";
import { autocompleteInputSchema } from "@repo/schemas";
import { env } from "@repo/env/server";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const placesRouter = createTRPCRouter({
  autocomplete: publicProcedure
    .input(autocompleteInputSchema)
    .query(async ({ input }) => {
      // Return empty results if Google Maps API key is not configured
      if (!env.GOOGLE_MAPS_API_KEY) {
        return [];
      }

      const placesProvider = new GooglePlacesProvider();

      return await placesProvider.autocomplete(input.input, {
        languageCode: input.languageCode,
        limit: input.limit,
      });
    }),
});
