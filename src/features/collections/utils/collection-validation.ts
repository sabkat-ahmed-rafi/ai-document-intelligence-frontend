import { z } from "zod";

export const collectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Collection name is required")
    .max(100, "Collection name must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

export type CollectionFormValues = z.infer<typeof collectionSchema>;
