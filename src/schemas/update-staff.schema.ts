import { Role } from "@/types/Role";
import { z } from "zod";

export const UpdateStaffSchema = z.object({
    name: z.optional(z.string().min(1, "Name is required")),
    email: z.optional(z.email("Enter a valid email").min(1, "Email is required")),
    password: z.optional(z.string().min(4, "Password must be at least 4 characters")),
    role: z.optional(z.enum(Role)),
})

export type UpdateStaffFormValues = z.infer<typeof UpdateStaffSchema>;