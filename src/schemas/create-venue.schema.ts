import { z } from "zod";

export const CreateVenueSchema = z.object({
  image: z
    .array(z.instanceof(File))
    .min(1, "Photo is required")
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "File must be under 5MB")
    .refine(
      (files) => ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type),
      "Only JPEG, PNG, or WEBP allowed"
    ),
  name: z.string().trim().min(1, "Name is required"),
  managers: z.array(z.string()).optional(),
});

export type CreateVenueFormValues = z.infer<typeof CreateVenueSchema>;
