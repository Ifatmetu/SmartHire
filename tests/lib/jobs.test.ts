import { afterEach, describe, expect, it, vi } from "vitest"

import { createJob } from "@/lib/actions/jobs"
import type { JobInput } from "@/lib/job-schema"

const validJob: JobInput = {
  title: "Frontend Engineer",
  companyName: "SmartHire",
  category: "Engineering & Tech",
  jobType: "Full-time",
  experienceLevel: "Mid level",
  vacancies: 2,
  isRemote: false,
  location: "Dhaka",
  deadline: null,
  currency: "Taka",
  minSalary: 60000,
  maxSalary: 90000,
  frequency: "per month",
  responsibilities: "Develop and maintain the SmartHire web interface.",
  qualifications: "Two years of frontend development experience.",
  skills: ["React", "TypeScript"],
  benefits: "",
  status: "draft",
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("createJob", () => {
  it("UT-ACTION-001 sends valid payload data to the jobs API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: vi.fn().mockResolvedValue({ id: "job-123" }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const result = await createJob(validJob)

    expect(result).toEqual({ id: "job-123" })
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/jobs",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validJob),
      })
    )
  })

  it("UT-ACTION-002 rejects invalid input before making a request", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    await expect(createJob({ ...validJob, title: "" })).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("UT-ACTION-003 uses an API error message for unsuccessful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: vi.fn().mockResolvedValue({ error: "Duplicate job" }),
      })
    )

    await expect(createJob(validJob)).rejects.toThrow("Duplicate job")
  })

  it("UT-ACTION-004 falls back to the response message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: vi.fn().mockResolvedValue({ message: "Validation failed" }),
      })
    )

    await expect(createJob(validJob)).rejects.toThrow("Validation failed")
  })

  it("UT-ACTION-005 falls back to an HTTP status error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: vi.fn().mockResolvedValue(null),
      })
    )

    await expect(createJob(validJob)).rejects.toThrow(
      "Could not create the job (503)"
    )
  })

  it("UT-ACTION-006 handles a non-JSON error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: vi.fn().mockRejectedValue(new SyntaxError("Invalid JSON")),
      })
    )

    await expect(createJob(validJob)).rejects.toThrow(
      "Could not create the job (502)"
    )
  })
})
