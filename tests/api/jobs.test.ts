import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { getSessionMock, insertOneMock, collectionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  insertOneMock: vi.fn(),
  collectionMock: vi.fn(),
}))

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: getSessionMock } },
}))

vi.mock("@/lib/mongodb", () => ({
  db: {
    collection: collectionMock.mockImplementation(() => ({
      insertOne: insertOneMock,
    })),
  },
}))

import { POST } from "@/app/api/jobs/route"
import type { JobInput } from "@/lib/job-schema"

const validJob: JobInput = {
  title: "Software Engineer",
  companyName: "SmartHire",
  category: "Engineering & Tech",
  jobType: "Full-time",
  experienceLevel: "Mid level",
  vacancies: 1,
  isRemote: true,
  location: "Dhaka",
  deadline: null,
  currency: "Taka",
  minSalary: null,
  maxSalary: null,
  frequency: "per month",
  responsibilities: "Implement reliable and maintainable application features.",
  qualifications: "Bachelor's degree in computer science.",
  skills: ["JavaScript"],
  benefits: "",
  status: "published",
}

function request(body: unknown) {
  return new Request("http://localhost/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}

beforeEach(() => {
  getSessionMock.mockReset()
  insertOneMock.mockReset()
  collectionMock.mockReset()
  collectionMock.mockImplementation(() => ({ insertOne: insertOneMock }))
  vi.spyOn(console, "error").mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("POST /api/jobs", () => {
  it("UT-API-001 returns 401 when the user is not signed in", async () => {
    getSessionMock.mockResolvedValue(null)

    const response = await POST(request(validJob))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      error: "You must be signed in to post a job.",
    })
    expect(insertOneMock).not.toHaveBeenCalled()
  })

  it("UT-API-002 returns 403 for a seeker role", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "u1", name: "Seeker", email: "seek@example.com", role: "seeker" },
    })

    const response = await POST(request(validJob))

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: "Only recruiters can post jobs.",
    })
    expect(insertOneMock).not.toHaveBeenCalled()
  })

  it("UT-API-003 returns 403 when the role is missing", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "u1", name: "User", email: "user@example.com" },
    })

    const response = await POST(request(validJob))

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: "Only recruiters can post jobs.",
    })
    expect(insertOneMock).not.toHaveBeenCalled()
  })

  it("UT-API-004 returns 400 for malformed JSON", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "u1", name: "Recruiter", email: "rec@example.com", role: "recruiter" },
    })

    const response = await POST(request("{invalid"))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "The request body must be valid JSON.",
    })
    expect(insertOneMock).not.toHaveBeenCalled()
  })

  it("UT-API-005 returns 400 for invalid job fields", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "u1", name: "Recruiter", email: "rec@example.com", role: "recruiter" },
    })

    const response = await POST(request({ ...validJob, title: "" }))

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toEqual(
      expect.objectContaining({
        error: "Please check the job details.",
        issues: expect.any(Array),
      })
    )
    expect(insertOneMock).not.toHaveBeenCalled()
  })

  it("UT-API-006 creates a job and returns 201 for a recruiter", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "u1", name: "Recruiter", email: "rec@example.com", role: "recruiter" },
    })
    insertOneMock.mockResolvedValue({ insertedId: { toString: () => "job-123" } })

    const response = await POST(request(validJob))

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({ id: "job-123" })
    expect(collectionMock).toHaveBeenCalledWith("jobs")
    expect(insertOneMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: validJob.title,
        recruiterId: "u1",
        recruiterName: "Recruiter",
        recruiterEmail: "rec@example.com",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it("UT-API-007 allows an admin to create a job", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "a1", name: "Admin", email: "admin@example.com", role: "admin" },
    })
    insertOneMock.mockResolvedValue({ insertedId: { toString: () => "job-456" } })

    const response = await POST(request(validJob))

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({ id: "job-456" })
  })

  it("UT-API-008 returns 500 when the database operation fails", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "u1", name: "Recruiter", email: "rec@example.com", role: "recruiter" },
    })
    insertOneMock.mockRejectedValue(new Error("Database unavailable"))

    const response = await POST(request(validJob))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: "Could not save the job. Please try again.",
    })
    expect(console.error).toHaveBeenCalledWith(
      "Failed to create job",
      expect.any(Error)
    )
  })
})
