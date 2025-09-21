import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-23",
  useCdn: true, // false if you need the freshest data
  token: process.env.SANITY_API_TOKEN, // only on server side
});