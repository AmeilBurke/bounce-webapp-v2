import { z } from "zod";

export const CreateVenueSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  managers: z.array(z.string()).optional(),
});

export type CreateVenueFormValues = z.infer<typeof CreateVenueSchema>;
