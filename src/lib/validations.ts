import { z } from "zod";

/**
 * Zod schema for Slam Book Entry validation
 */
export const entrySchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  nickname: z.string().min(1, "Nickname is required").min(2, "Nickname must be at least 2 characters"),
  birthday: z.string().min(1, "Birthday is required").refine(
    (date) => {
      const dateObj = new Date(date);
      const today = new Date();
      return dateObj <= today;
    },
    { message: "Birthday cannot be in the future" }
  ),
  contactNumber: z.string().min(1, "Contact number is required").regex(/^[\d\s\-\+\(\)]+$/, "Invalid contact number format"),
  likes: z.string().optional(),
  dislikes: z.string().optional(),
  favoriteMovie: z.string().optional(),
  favoriteFood: z.string().optional(),
  about: z.string().min(1, "About yourself is required").min(10, "About yourself must be at least 10 characters"),
  message: z.string().min(1, "Message is required").min(5, "Message must be at least 5 characters"),
  tags: z.array(z.string()).optional(),
});

export type EntryFormData = z.infer<typeof entrySchema>;



