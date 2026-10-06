import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().max(40).optional().nullable(),
  recipientName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(8).max(20),
  line1: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(80),
  pincode: z.string().trim().min(5).max(10),
  isDefault: z.boolean().optional(),
});

export const addressPatchSchema = addressSchema.partial();
