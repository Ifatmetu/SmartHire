import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  BriefcaseBusiness,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Users,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { db } from "@/lib/mongodb"
import { cn } from "@/lib/utils"

type JobRow = {
  _id: unknown
  recruiterId: string
  title: string
  companyName: string
  category: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string | null
  status: "draft" | "published"
  createdAt: Date

  // Optional fields
  minSalary?: number
  maxSalary?: number
  frequency?: string
  applicantsCount?: number
}

function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00`) : value

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function formatSalary(job: JobRow) {
  if (job.minSalary === undefined && job.maxSalary === undefined) {
    return "—"
  }

  const min = job.minSalary ?? 0
  const max = job.maxSalary ?? 0

  if (min && max) {
    return `€${min} – €${max} / ${job.frequency ?? "month"}`
  }

  if (min) {
    return `From €${min} / ${job.frequency ?? "month"}`
  }

  return `Up to €${max} / ${job.frequency ?? "month"}`
}

export default async function RecruiterJobsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/Sign-in")
  }

  const canManageJobs =
    session.user.role === "recruiter" || session.user.role === "admin"

  if (!canManageJobs) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-6">
        <h1 className="text-lg font-semibold">Recruiters only</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account is registered as a job seeker, so it cannot post or
          manage job listings.
        </p>

        <Link
          href="/dashboard/seeker"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          Go to seeker dashboard
        </Link>
      </div>
    )
  }

  const jobs = await db
    .collection<JobRow>("jobs")
    .find({
      recruiterId: session.user.id,
    })
    .sort({
      createdAt: -1,
    })
    .toArray()

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Job Posts
          </h1>

          <p className="text-sm text-muted-foreground">
            Review live listings, monitor applications, and update job details
            across your organization.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            buttonVariants(),
            "gap-1.5 self-start bg-indigo-600 text-white hover:bg-indigo-500 sm:self-auto"
          )}
        >
          <Plus className="size-4" />
          New Job Post
        </Link>
      </div>

      {jobs.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />

          <h2 className="mt-3 text-base font-medium">No job listings yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first listing to start receiving applications.
          </p>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className={cn(buttonVariants(), "mt-4 gap-1.5")}
          >
            <Plus className="size-4" />
            Post a new job
          </Link>
        </div>
      ) : (
        /* JOB TABLE */
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
          {/* Horizontal scroll for smaller screens */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] table-fixed text-sm">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[9%]" />
                <col className="w-[13%]" />
                <col className="w-[10%]" />
                <col className="w-[9%]" />
                <col className="w-[8%]" />
                <col className="w-[16%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-white/10 bg-[#151515]">
                  <th className="px-4 py-3 pl-5 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Job Title & Dept
                  </th>

                  <th className="px-4 py-3 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Company & Location
                  </th>

                  <th className="px-4 py-3 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Compensation
                  </th>

                  <th className="px-4 py-3 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Applicants
                  </th>

                  <th className="px-4 py-3 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Deadline
                  </th>

                  <th className="px-4 py-3 pr-5 text-right align-middle text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={String(job._id)}
                    className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    {/* JOB TITLE */}
                    <td className="px-4 py-4 pl-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1d1d1f]">
                          <BriefcaseBusiness className="size-4 text-indigo-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {job.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-indigo-400">
                            {job.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* COMPANY */}
                    <td className="px-4 py-4 align-middle">
                      <p className="truncate text-sm font-medium text-white">
                        {job.companyName}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                        <MapPin className="size-3.5 shrink-0" />

                        <span className="truncate">
                          {job.location}
                          {job.isRemote ? " (Remote)" : ""}
                        </span>
                      </p>
                    </td>

                    {/* JOB TYPE */}
                    <td className="px-4 py-4 align-middle">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-neutral-300">
                        {job.jobType}
                      </span>
                    </td>

                    {/* COMPENSATION */}
                    <td className="px-4 py-4 align-middle">
                      <p className="truncate text-xs font-medium text-neutral-300">
                        {formatSalary(job)}
                      </p>
                    </td>

                    {/* APPLICANTS */}
                    <td className="px-4 py-4 align-middle">
                      <p className="flex items-center gap-1.5 text-xs text-neutral-300">
                        <Users className="size-3.5 shrink-0 text-neutral-400" />

                        <span className="whitespace-nowrap">
                          {job.applicantsCount ?? 0} Candidates
                        </span>
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4 align-middle">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap capitalize",
                          job.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            job.status === "published"
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          )}
                        />

                        {job.status === "published" ? "Active" : "Draft"}
                      </span>
                    </td>

                    {/* DEADLINE */}
                    <td className="px-4 py-4 align-middle">
                      <p className="text-xs whitespace-nowrap text-neutral-300">
                        {job.deadline ? formatDate(job.deadline) : "—"}
                      </p>

                      <p className="mt-1 text-[11px] whitespace-nowrap text-neutral-500">
                        {job.status === "published"
                          ? "Posted recently"
                          : "Not published"}
                      </p>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4 pr-5 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/recruiter/jobs/${job._id}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 text-xs font-medium whitespace-nowrap text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Pencil className="size-3.5" />
                          Update
                        </Link>

                        <button
                          type="button"
                          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
                          aria-label="More actions"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER INFO */}
      {jobs.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {jobs.length} job listing
          {jobs.length === 1 ? "" : "s"} in your workspace.
        </p>
      )}
    </div>
  )
}
