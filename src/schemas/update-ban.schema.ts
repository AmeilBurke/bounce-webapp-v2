import { z } from "zod";

export const UpdateBanSchema = z
  .object({
    reason: z.string().trim().min(1, "Reason is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    venueIds: z.array(z.string()).min(1, "Choose at least one venue"),
  })
  .superRefine((values, ctx) => {
    // YYYY-MM-DD strings compare correctly as text
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date can't be before the start date" });
    }
  });

export type UpdateBanFormValues = z.infer<typeof UpdateBanSchema>;
