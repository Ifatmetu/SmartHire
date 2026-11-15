import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { jobSchema } from "@/lib/job-schema"
import { db } from "@/lib/mongodb"

const ALLOWED_ROLES = new Set(["recruiter", "admin"])

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to post a job." },
      { status: 401 }
    )
  }

  if (!session.user.role || !ALLOWED_ROLES.has(session.user.role)) {
    return NextResponse.json(
      { error: "Only recruiters can post jobs." },
      { status: 403 }
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "The request body must be valid JSON." },
      { status: 400 }
    )
  }

  const parsed = jobSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the job details.", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const now = new Date()

  try {
    const result = await db.collection("jobs").insertOne({
      ...parsed.data,
      recruiterId: session.user.id,
      recruiterName: session.user.name,
      recruiterEmail: session.user.email,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { id: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create job", error)

    return NextResponse.json(
      { error: "Could not save the job. Please try again." },
      { status: 500 }
    )
  }
}
