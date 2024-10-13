import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email is invalid").min(1, "Required"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export type ILoginSchema = z.infer<typeof loginSchema>;
