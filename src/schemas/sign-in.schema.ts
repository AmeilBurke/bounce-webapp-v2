import { z } from "zod";

export const SignInSchema = z.object({
    email: z.email("Enter a valid email").min(1, "Email is required"),
    password: z.string().min(4, "Password is at least 4 characters"),
});

export type SignInFormValues = z.infer<typeof SignInSchema>;
