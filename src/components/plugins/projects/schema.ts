import * as z from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  region: z.string().min(1, "Project region is required"),
  currency: z.enum(
    ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD", "CHF", "CNY"],
    {
      required_error: "Currency is required",
    }
  ),

  deadline: z.date().optional(),
  significance: z.string().min(1, "Significance is required"),
  solution: z.string().min(1, "Solution is required"),
  bannerImage: z
    .object({
      file: z.instanceof(File, { message: "Banner must be a valid file" }),
      type: z.enum(["image/jpeg", "image/png", "image/webp"]),
      size: z.number().max(5 * 1024 * 1024, "Banner must be less than 5MB"),
    })
    .nullable()
    .optional(),
  committees: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        designation: z.string().min(1, "Designation is required"),
      })
    )
    .min(1, "At least one committee member is required"),
  parameters: z
    .array(z.object({})) // Define an array of objects
    .min(1, "Array must contain at least one object"), // Ensure array has at least one element
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .min(1, "At least one FAQ is required"),
  fundingDetails: z.string().min(1, "Funding details are required"),
  aboutPromoters: z.string().min(1, "About promoters is  required"),
  keyTakeaways: z.string().min(1, "Key Takeaway is  required"),
  risksAndChallenges: z.string().min(1, "Risks and challenges are required"),
  closingRemark: z.string().min(1, "closing Remark is required"),

  isPublic: z.boolean().default(false),
  files: z
    .array(
      z.object({
        file: z.instanceof(File, { message: "File is required" }),
        type: z.enum([
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ]),
        size: z.number().max(10 * 1024 * 1024, "File must be less than 10MB"),
      })
    )
    .min(1, "At least one file is required")
    .optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
