import { z } from "zod";

export const UpdateVenueSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  managers: z.array(z.string()),
  dutyManagers: z.array(z.string()),
});

export type UpdateVenueFormValues = z.infer<typeof UpdateVenueSchema>;
