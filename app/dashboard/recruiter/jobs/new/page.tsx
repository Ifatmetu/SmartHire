"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  MapPin,
  Plus,
  Save,
} from "lucide-react"
import { toast } from "react-toastify"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  CURRENCIES,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  jobSchema,
  type Currency,
  type ExperienceLevel,
  type JobStatus,
  type JobType,
  type SalaryFrequency,
} from "@/lib/job-schema"
import { cn } from "@/lib/utils"

type JobFormState = {
  title: string
  companyName: string
  category: string
  jobType: JobType
  experienceLevel: ExperienceLevel
  vacancies: string
  isRemote: boolean
  location: string
  deadline: string
  currency: Currency
  minSalary: string
  maxSalary: string
  frequency: SalaryFrequency
  responsibilities: string
  qualifications: string
  skills: string
  benefits: string
}

const INITIAL_FORM: JobFormState = {
  title: "",
  companyName: "",
  category: "",
  jobType: "Full-time",
  experienceLevel: "Mid level",
  vacancies: "1",
  isRemote: false,
  location: "",
  deadline: "",
  currency: "EUR",
  minSalary: "",
  maxSalary: "",
  frequency: "per year",
  responsibilities: "",
  qualifications: "",
  skills: "",
  benefits: "",
}

function toNullableNumber(value: string) {
  if (value.trim() === "") return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState<JobFormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submittingStatus, setSubmittingStatus] = useState<JobStatus | null>(
    null
  )

  const isSubmitting = submittingStatus !== null

  function update<K extends keyof JobFormState>(
    key: K,
    value: JobFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))

    setErrors((current) => {
      if (!(key in current)) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function handleSubmit(status: JobStatus) {
    if (isSubmitting) return

    const payload = {
      title: form.title,
      companyName: form.companyName,
      category: form.category,
      jobType: form.jobType,
      experienceLevel: form.experienceLevel,
      vacancies: Number(form.vacancies),
      isRemote: form.isRemote,
      location: form.location,
      deadline: form.deadline === "" ? null : form.deadline,
      currency: form.currency,
      minSalary: toNullableNumber(form.minSalary),
      maxSalary: toNullableNumber(form.maxSalary),
      frequency: form.frequency,
      responsibilities: form.responsibilities,
      qualifications: form.qualifications,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      benefits: form.benefits,
      status,
    }

    const parsed = jobSchema.safeParse(payload)

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}

      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message
        }
      }

      setErrors(nextErrors)
      const firstInvalidField = Object.keys(nextErrors)[0]
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus()
      }
      toast.error("Please fix the highlighted fields.")
      return
    }

    setErrors({})
    setSubmittingStatus(status)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })

      const data = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (!response.ok) {
        throw new Error(data?.error ?? "Could not save the job.")
      }

      toast.success(
        status === "draft"
          ? "Job saved as a draft."
          : "Job published successfully."
      )
      router.push("/dashboard/recruiter/jobs")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save the job."
      )
    } finally {
      setSubmittingStatus(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Manage Jobs
          </Link>
          <span aria-hidden="true">/</span>
          <span>Create New Listing</span>
        </div>

        <h1 className="text-2xl font-bold sm:text-3xl">Post a New Job</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the position specifications to attract qualified talent across
          our network.
        </p>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit("published")
        }}
        className="space-y-4"
      >
        {/* 1. BASIC INFORMATION */}
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <SectionTitle number="1" title="Basic Information" />

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <Required />
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Frontend Developer"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                aria-invalid={Boolean(errors.title)}
              />
              <FieldError message={errors.title} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <Required />
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="HirePulse Network"
                  value={form.companyName}
                  onChange={(event) =>
                    update("companyName", event.target.value)
                  }
                  aria-invalid={Boolean(errors.companyName)}
                />
                <FieldError message={errors.companyName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Job Category <Required />
                </Label>
                <Select
                  value={form.category || null}
                  onValueChange={(value) => update("category", value ?? "")}
                >
                  <SelectTrigger
                    id="category"
                    className="w-full"
                    aria-invalid={Boolean(errors.category)}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.category} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Job Type <Required />
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update("jobType", type)}
                    aria-pressed={form.jobType === type}
                    className={cn(
                      "h-8 rounded-lg border text-sm transition-colors",
                      form.jobType === type
                        ? "border-indigo-500 bg-indigo-500/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <FieldError message={errors.jobType} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">
                  Experience Level <Required />
                </Label>
                <Select
                  value={form.experienceLevel}
                  onValueChange={(value) => {
                    if (value) {
                      update("experienceLevel", value as ExperienceLevel)
                    }
                  }}
                >
                  <SelectTrigger
                    id="experienceLevel"
                    className="w-full"
                    aria-invalid={Boolean(errors.experienceLevel)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.experienceLevel} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vacancies">
                  Number of Vacancies <Required />
                </Label>
                <Input
                  id="vacancies"
                  name="vacancies"
                  type="number"
                  min={1}
                  max={999}
                  step={1}
                  value={form.vacancies}
                  onChange={(event) => update("vacancies", event.target.value)}
                  aria-invalid={Boolean(errors.vacancies)}
                />
                <FieldError message={errors.vacancies} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. LOCATION / SALARY */}
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <SectionTitle number="2" title="Location, Compensation & Timeline" />

          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <BriefcaseBusiness className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="isRemote" className="text-sm font-medium">
                    Remote work allowed
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Accept candidates from anywhere in the world.
                  </p>
                </div>
              </div>

              <Switch
                id="isRemote"
                checked={form.isRemote}
                onCheckedChange={(checked) => update("isRemote", checked)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">
                  {form.isRemote ? "Remote Region" : "Job Location"}{" "}
                  <Required />
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder={
                      form.isRemote ? "Worldwide / EU remote" : "New York, USA"
                    }
                    className="pl-9"
                    value={form.location}
                    onChange={(event) => update("location", event.target.value)}
                    aria-invalid={Boolean(errors.location)}
                  />
                </div>
                <FieldError message={errors.location} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="pl-9"
                    value={form.deadline}
                    onChange={(event) => update("deadline", event.target.value)}
                    aria-invalid={Boolean(errors.deadline)}
                  />
                </div>
                <FieldError message={errors.deadline} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(value) => {
                    if (value) update("currency", value as Currency)
                  }}
                >
                  <SelectTrigger
                    id="currency"
                    className="w-full"
                    aria-invalid={Boolean(errors.currency)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.currency} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minSalary">Min Salary / Rate</Label>
                <Input
                  id="minSalary"
                  name="minSalary"
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  placeholder="45000"
                  value={form.minSalary}
                  onChange={(event) => update("minSalary", event.target.value)}
                  aria-invalid={Boolean(errors.minSalary)}
                />
                <FieldError message={errors.minSalary} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSalary">Max Salary / Rate</Label>
                <Input
                  id="maxSalary"
                  name="maxSalary"
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  placeholder="65000"
                  value={form.maxSalary}
                  onChange={(event) => update("maxSalary", event.target.value)}
                  aria-invalid={Boolean(errors.maxSalary)}
                />
                <FieldError message={errors.maxSalary} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(value) => {
                    if (value) update("frequency", value as SalaryFrequency)
                  }}
                >
                  <SelectTrigger
                    id="frequency"
                    className="w-full"
                    aria-invalid={Boolean(errors.frequency)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_FREQUENCIES.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.frequency} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Leave the salary fields empty if the compensation is negotiable or
              undisclosed.
            </p>
          </div>
        </section>

        {/* 3. RESPONSIBILITIES */}
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <SectionTitle number="3" title="Responsibilities & Requirements" />

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="responsibilities">
                Key Responsibilities <Required />
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                rows={5}
                placeholder="Describe the main responsibilities of this position..."
                className="resize-none"
                value={form.responsibilities}
                onChange={(event) =>
                  update("responsibilities", event.target.value)
                }
                aria-invalid={Boolean(errors.responsibilities)}
              />
              <FieldError message={errors.responsibilities} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">
                Qualifications & Requirements <Required />
              </Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                rows={5}
                placeholder={
                  "• 3+ years of experience with React, TypeScript...\n• Strong understanding of modern web development..."
                }
                className="resize-none"
                value={form.qualifications}
                onChange={(event) =>
                  update("qualifications", event.target.value)
                }
                aria-invalid={Boolean(errors.qualifications)}
              />
              <FieldError message={errors.qualifications} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="React, TypeScript, Tailwind CSS, Node.js"
                value={form.skills}
                onChange={(event) => update("skills", event.target.value)}
                aria-invalid={Boolean(errors.skills)}
              />
              <p className="text-xs text-muted-foreground">
                Separate each skill with a comma.
              </p>
              <FieldError message={errors.skills} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (Optional)</Label>
              <Textarea
                id="benefits"
                name="benefits"
                rows={4}
                placeholder="Health insurance, remote stipend, 25 days of paid leave..."
                className="resize-none"
                value={form.benefits}
                onChange={(event) => update("benefits", event.target.value)}
                aria-invalid={Boolean(errors.benefits)}
              />
              <FieldError message={errors.benefits} />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Drafts are only visible to you until you publish them.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/recruiter/jobs"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-center"
              )}
            >
              Cancel
            </Link>

            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => void handleSubmit("draft")}
            >
              {submittingStatus === "draft" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save />
              )}
              Save as draft
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              {submittingStatus === "published" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Publish job
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500/10 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
        {number}
      </span>
      <h2 className="text-sm font-medium">{title}</h2>
    </div>
  )
}

function Required() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="text-xs text-destructive">{message}</p>
}
