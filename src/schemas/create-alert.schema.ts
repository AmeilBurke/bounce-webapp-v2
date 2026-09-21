import { z } from "zod";

export const CreateAlertSchema = z.object({
  image: z
    .array(z.instanceof(File))
    .min(1, "Photo is required")
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "File must be under 5MB")
    .refine(
      (files) => ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type),
      "Only JPEG, PNG, or WEBP allowed"
    ),
  reason: z.string().min(1, "Reason is required"),
  personId: z.number().optional(),
});

export type CreateAlertFormValues = z.infer<typeof CreateAlertSchema>;