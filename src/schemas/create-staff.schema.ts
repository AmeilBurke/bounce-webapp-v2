import { Role } from "@/types/Role";
import { z } from "zod";

export const CreateStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(Role),
})

export type CreateStaffFormValues = z.infer<typeof CreateStaffSchema>;