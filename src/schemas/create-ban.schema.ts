import { z } from "zod";

// personId value meaning "create a new banned person" rather than picking an existing one
export const NEW_PERSON = "new";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const CreateBanSchema = z
  .object({
    personId: z.string().min(1, "Choose a person"),
    name: z.string().trim().optional(),
    image: z.array(z.instanceof(File)).optional(),
    reason: z.string().trim().min(1, "Reason is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    venueIds: z.array(z.string()).min(1, "Choose at least one venue"),
  })
  .superRefine((values, ctx) => {
    if (values.personId === NEW_PERSON) {
      if (!values.name) {
        ctx.addIssue({ code: "custom", path: ["name"], message: "Name is required" });
      }

      const file = values.image?.[0];
      if (!file) {
        ctx.addIssue({ code: "custom", path: ["image"], message: "Photo is required" });
      } else if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({ code: "custom", path: ["image"], message: "File must be under 5MB" });
      } else if (!IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({ code: "custom", path: ["image"], message: "Only JPEG, PNG, or WEBP allowed" });
      }
    }

    // YYYY-MM-DD strings compare correctly as text
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date can't be before the start date" });
    }
  });

export type CreateBanFormValues = z.infer<typeof CreateBanSchema>;
