import { z } from "zod";

export const UpdateVenueManagersSchema = z.object({
  managers: z.array(z.string()),
  dutyManagers: z.array(z.string()),
});

export type UpdateVenueManagersFormValues = z.infer<typeof UpdateVenueManagersSchema>;
