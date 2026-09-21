import { z } from "zod";

export const SetupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Enter a valid email").min(1, "Email is required"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SetupFormValues = z.infer<typeof SetupSchema>;