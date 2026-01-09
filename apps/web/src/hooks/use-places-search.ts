import * as React from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { env } from "@repo/env/client";

import { useTRPC } from "@/lib/trpc/client";

// Check if Google Maps API key is configured
const hasGoogleMapsKey = Boolean(env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

if (typeof window !== "undefined" && hasGoogleMapsKey) {
  setOptions({
    key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
}

type AutocompleteRequest = google.maps.places.AutocompleteRequest;
type AutocompleteSessionToken = google.maps.places.AutocompleteSessionToken;

interface UsePlacesSearchOptions {
  enabled: boolean;
}

export function usePlacesSearch(
  request: AutocompleteRequest,
  options?: UsePlacesSearchOptions,
) {
  const sessionTokenRef = React.useRef<AutocompleteSessionToken>(undefined);

  const trpc = useTRPC();
  const { data: coordinates } = useQuery(
    trpc.user.approximateLocation.queryOptions(undefined, {
      enabled: options?.enabled && hasGoogleMapsKey,
    }),
  );

  return useQuery({
    queryKey: [request.input],
    queryFn: async () => {
      // Return empty if no API key or empty input
      if (!hasGoogleMapsKey || request.input.trim() === "") {
        return {
          suggestions: [],
        };
      }

      const { AutocompleteSuggestion, AutocompleteSessionToken } =
        await importLibrary("places");

      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      return AutocompleteSuggestion.fetchAutocompleteSuggestions({
        ...request,
        locationBias: coordinates
          ? {
            center: {
              lat: coordinates.latitude,
              lng: coordinates.longitude,
            },
            radius: 20000,
          }
          : "IP_BIAS",
        sessionToken: sessionTokenRef.current,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 1,
    // Only enable if API key is present
    enabled: options?.enabled && hasGoogleMapsKey,
  });
}
