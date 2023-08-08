import * as z from "zod";

export const yarnSchema = z.object({
  yarn: z
    .string()
    .nonempty()
    .min(3, { message: "Minimum 3 characters" })
    .max(30),
  accountId: z.string(),
});

export const commentSchema = z.object({
  yarn: z
    .string()
    .nonempty()
    .min(3, { message: "Minimum 3 characters" })
    .max(30),
});
