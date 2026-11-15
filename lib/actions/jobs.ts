import { jobSchema, type JobInput } from "@/lib/job-schema"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:5000"

/**
 * Sends a job to the external jobs API. The payload is validated again so this
 * helper stays safe when called outside the create-job form.
 *
 * Note: it is not wired into the create-job page yet — that page posts to the
 * Next.js route at `/api/jobs`. Use this once the external backend exposes
 * `POST /jobs`.
 */
export async function createJob(jobData: JobInput) {
  const payload = jobSchema.parse(jobData)

  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as {
    error?: string
    message?: string
  } | null

  if (!response.ok) {
    throw new Error(
      data?.error ??
        data?.message ??
        `Could not create the job (${response.status}).`
    )
  }

  return data
}
