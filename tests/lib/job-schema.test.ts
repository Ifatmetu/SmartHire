import { describe, expect, it } from "vitest"

import { jobSchema, type JobInput } from "@/lib/job-schema"

const validJob: JobInput = {
  title: "Senior Backend Engineer",
  companyName: "Acme Technologies",
  category: "Engineering & Tech",
  jobType: "Full-time",
  experienceLevel: "Senior",
  vacancies: 3,
  isRemote: true,
  location: "Dhaka",
  deadline: "2026-12-31",
  currency: "Taka",
  minSalary: 80000,
  maxSalary: 120000,
  frequency: "per month",
  responsibilities: "Build and maintain reliable recruitment platform services.",
  qualifications: "Three years of backend engineering experience.",
  skills: ["TypeScript", "MongoDB"],
  benefits: "Health insurance",
  status: "published",
}

describe("jobSchema", () => {
  it("UT-SCHEMA-001 accepts valid job information", () => {
    expect(jobSchema.safeParse(validJob).success).toBe(true)
  })

  it("UT-SCHEMA-002 rejects a title shorter than three characters", () => {
    const result = jobSchema.safeParse({ ...validJob, title: "HR" })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["title"])
    }
  })

  it("UT-SCHEMA-003 rejects a missing company name", () => {
    const result = jobSchema.safeParse({ ...validJob, companyName: "" })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-004 rejects responsibilities shorter than 20 characters", () => {
    const result = jobSchema.safeParse({ ...validJob, responsibilities: "Build APIs" })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-005 rejects a negative minimum salary", () => {
    const result = jobSchema.safeParse({ ...validJob, minSalary: -1 })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-006 rejects a maximum salary below the minimum", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      minSalary: 120000,
      maxSalary: 80000,
    })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-007 rejects unsupported job types", () => {
    const result = jobSchema.safeParse({ ...validJob, jobType: "Temporary" })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-008 accepts nullable salary fields and deadline", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      minSalary: null,
      maxSalary: null,
      deadline: null,
    })

    expect(result.success).toBe(true)
  })

  it("UT-SCHEMA-009 rejects fractional vacancies", () => {
    const result = jobSchema.safeParse({ ...validJob, vacancies: 1.5 })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-010 rejects a malformed deadline", () => {
    const result = jobSchema.safeParse({ ...validJob, deadline: "31-12-2026" })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-011 trims title and skill strings", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      title: "  Software Engineer  ",
      skills: ["  TypeScript  "],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe("Software Engineer")
      expect(result.data.skills).toEqual(["TypeScript"])
    }
  })

  it("UT-SCHEMA-012 rejects an empty skill", () => {
    const result = jobSchema.safeParse({ ...validJob, skills: ["  "] })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-013 rejects zero vacancies", () => {
    const result = jobSchema.safeParse({ ...validJob, vacancies: 0 })

    expect(result.success).toBe(false)
  })

  it("UT-SCHEMA-014 accepts minimum and maximum vacancy boundaries", () => {
    expect(jobSchema.safeParse({ ...validJob, vacancies: 1 }).success).toBe(true)
    expect(jobSchema.safeParse({ ...validJob, vacancies: 999 }).success).toBe(true)
  })

  it("UT-SCHEMA-015 accepts equal minimum and maximum salaries", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      minSalary: 100000,
      maxSalary: 100000,
    })

    expect(result.success).toBe(true)
  })
})
