import { z } from "zod"

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Customer Support",
  "Operations",
  "Other",
] as const

export const EXPERIENCE_LEVELS = [
  "Entry level",
  "Junior",
  "Mid level",
  "Senior",
  "Lead / Principal",
] as const

export const SALARY_FREQUENCIES = [
  "per hour",
  "per day",
  "per week",
  "per month",
  "per year",
] as const

export const CURRENCIES = ["Taka","EUR", "USD", "GBP", "CAD", "AUD", "INR"] as const

export const JOB_STATUSES = ["draft", "published"] as const

export type JobType = (typeof JOB_TYPES)[number]
export type JobCategory = (typeof JOB_CATEGORIES)[number]
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]
export type SalaryFrequency = (typeof SALARY_FREQUENCIES)[number]
export type Currency = (typeof CURRENCIES)[number]
export type JobStatus = (typeof JOB_STATUSES)[number]

export const jobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Job title must be at least 3 characters.")
      .max(120, "Job title must be 120 characters or fewer."),
    companyName: z
      .string()
      .trim()
      .min(2, "Company name is required.")
      .max(120, "Company name must be 120 characters or fewer."),
    category: z.enum(JOB_CATEGORIES, "Select a job category."),
    jobType: z.enum(JOB_TYPES, "Select a job type."),
    experienceLevel: z.enum(EXPERIENCE_LEVELS, "Select an experience level."),
    vacancies: z
      .number()
      .int("Vacancies must be a whole number.")
      .min(1, "There must be at least one vacancy.")
      .max(999, "Vacancies cannot exceed 999."),
    isRemote: z.boolean(),
    location: z
      .string()
      .trim()
      .min(2, "Job location is required.")
      .max(120, "Location must be 120 characters or fewer."),
    deadline: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid deadline.")
      .nullable(),
    currency: z.enum(CURRENCIES, "Select a currency."),
    minSalary: z.number().min(0, "Salary cannot be negative.").nullable(),
    maxSalary: z.number().min(0, "Salary cannot be negative.").nullable(),
    frequency: z.enum(SALARY_FREQUENCIES, "Select a salary frequency."),
    responsibilities: z
      .string()
      .trim()
      .min(20, "Describe the responsibilities in at least 20 characters.")
      .max(5000, "Responsibilities must be 5000 characters or fewer."),
    qualifications: z
      .string()
      .trim()
      .min(10, "Describe the qualifications in at least 10 characters.")
      .max(5000, "Qualifications must be 5000 characters or fewer."),
    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skills cannot be empty.")
          .max(60, "Each skill must be 60 characters or fewer.")
      )
      .max(50, "Add at most 50 skills."),
    benefits: z
      .string()
      .trim()
      .max(2000, "Benefits must be 2000 characters or fewer."),
    status: z.enum(JOB_STATUSES, "Choose whether to publish or save as draft."),
  })
  .superRefine((data, ctx) => {
    if (
      data.minSalary !== null &&
      data.maxSalary !== null &&
      data.minSalary > data.maxSalary
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxSalary"],
        message: "Maximum salary must be greater than or equal to the minimum.",
      })
    }
  })

export type JobInput = z.infer<typeof jobSchema>
