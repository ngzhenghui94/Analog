import { cache } from "react";

import { env } from "@repo/env/server";

import type {
  MarbleAuthorList,
  MarbleCategoryList,
  MarblePost,
  MarblePostList,
  MarbleTagList,
} from "@/types/post";

async function fetchFromMarble<T>(endpoint: string): Promise<T> {
  // If we are in development or build without a valid key, return a mock/empty response to allow build to pass
  if (
    process.env.NODE_ENV === "production" &&
    env.MARBLE_WORKSPACE_KEY === "dummy_key_for_build"
  ) {
    console.warn(
      `Mocking Marble response for ${endpoint} due to dummy key during build`,
    );
    // @ts-ignore - mocking response
    return {
      posts: [],
      tags: [],
      categories: [],
      authors: [],
      data: [],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        nextPage: null,
        previousPage: null,
      },
    } as unknown as T;
  }

  try {
    const response = await fetch(
      `${env.MARBLE_API_URL}/${env.MARBLE_WORKSPACE_KEY}/${endpoint}`,
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`,
      );
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const getPosts = cache(async () => {
  return fetchFromMarble<MarblePostList>("posts");
});

export const getTags = cache(async () => {
  return fetchFromMarble<MarbleTagList>("tags");
});

export const getSinglePost = cache(async (slug: string) => {
  return fetchFromMarble<MarblePost>(`posts/${slug}`);
});

export const getCategories = cache(async () => {
  return fetchFromMarble<MarbleCategoryList>("categories");
});

export const getAuthors = cache(async () => {
  return fetchFromMarble<MarbleAuthorList>("authors");
});
