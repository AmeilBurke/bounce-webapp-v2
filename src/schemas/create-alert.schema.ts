import { z } from "zod";

// personId value meaning the alert is about someone new, so it needs its own photo
export const NEW_PERSON = "new";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const CreateAlertSchema = z
  .object({
    personId: z.string().min(1, "Choose a person"),
    image: z.array(z.instanceof(File)).optional(),
    reason: z.string().min(1, "Reason is required"),
  })
  .superRefine((values, ctx) => {
    // Alerts about someone previously banned reuse their photo
    if (values.personId !== NEW_PERSON) return;

    const file = values.image?.[0];
    if (!file) {
      ctx.addIssue({ code: "custom", path: ["image"], message: "Photo is required" });
    } else if (file.size > 5 * 1024 * 1024) {
      ctx.addIssue({ code: "custom", path: ["image"], message: "File must be under 5MB" });
    } else if (!IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({ code: "custom", path: ["image"], message: "Only JPEG, PNG, or WEBP allowed" });
    }
  });

export type CreateAlertFormValues = z.infer<typeof CreateAlertSchema>;
