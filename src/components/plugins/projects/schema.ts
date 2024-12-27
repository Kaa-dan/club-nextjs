import * as z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_BANNER_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BANNER_SIZE = 2 * 1024 * 1024; // 2MB

export const projectFormSchema = z
  .object({
    title: z.string().min(1, "Project title is required"),
    region: z.string().min(1, "Project region is required"),
    currency: z.string({
      required_error: "Currency is required",
    }),
    budgetMin: z.string().min(1, "Minimum budget is required"),
    budgetMax: z.string().min(1, "Maximum budget is required"),
    deadline: z.date().optional(),
    significance: z.string().min(1, "Significance is required"),
    solution: z.string().min(1, "Solution is required"),
    relatedEvent: z.string().min(1, "Related event is required"),
    champions: z
      .array(z.string())
      .nonempty("At least one champion is required"),
    committees: z
      .array(
        z.object({
          name: z.string().min(1, "Name is Required"),
          userId: z.string(),
          designation: z.string().min(1, "Designation is required"),
        })
      )
      .nonempty("At least one committee member is required"),
    parameters: z
      .array(
        z.object({
          title: z.string(),
          value: z.string(),
          unit: z.string(),
        })
      )
      .nonempty("At least one parameter is required"),
    faqs: z
      .array(
        z.object({
          question: z.string().min(1, "Question is required"),
          answer: z.string().min(1, "Answer is required"),
        })
      )
      .min(1, "At least one FAQ is required"),
    fundingDetails: z.string().min(1, "Funding details are required"),
    aboutPromoters: z.string().min(1, "About promoters is required"),
    keyTakeaways: z.string().min(1, "Key Takeaway is required"),
    risksAndChallenges: z.string().min(1, "Risks and challenges are required"),
    closingRemark: z.string().min(1, "Closing Remark is required"),
    howToTakePart: z.string().min(1, "How to take part is required"),

    isPublic: z.boolean().default(false),
    files: z
      .array(
        z.object({
          file: z
            .instanceof(File)
            .refine(
              (file) => file.size <= MAX_FILE_SIZE,
              `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            )
            .refine(
              (file) => ACCEPTED_FILE_TYPES.includes(file.type),
              `File type must be one of: ${ACCEPTED_FILE_TYPES.join(", ")}`
            ),
          preview: z.string().optional(),
        })
      )
      .min(1, "At least one file is required"),
    banner: z
      .instanceof(File)
      .refine(
        (file) => file.size <= MAX_BANNER_SIZE,
        `Banner size should be less than ${MAX_BANNER_SIZE / (1024 * 1024)}MB`
      )
      .refine(
        (file) => ACCEPTED_BANNER_TYPES.includes(file.type),
        `Banner must be an image file (${ACCEPTED_BANNER_TYPES.join(", ")})`
      )
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const min = Number(data.budgetMin);
      const max = Number(data.budgetMax);
      return max >= min;
    },
    {
      message: "Maximum budget cannot be less than minimum budget",
      path: ["budgetMax"],
    }
  );
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
