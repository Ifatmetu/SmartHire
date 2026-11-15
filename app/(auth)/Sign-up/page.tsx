"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/user-role"
import { toast } from "react-toastify"

const MIN_PASSWORD_LENGTH = 8

const ROLE_OPTIONS = [
  {
    value: "seeker",
    label: "Job seeker",
    description: "I'm looking for a job",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "I'm hiring talent",
  },
  {
    value: "admin",
    label: "Admin",
    description: "I manage the platform",
  },
] satisfies { value: UserRole; label: string; description: string }[]

export default function Signup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("seeker")

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)

    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (!name || !email) {
      toast.error("Please fill in your name and email.")
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      })

      if (error) {
        toast.error(error.message || "Registration failed!")
        return
      }

      toast.success("Account created successfully!")
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Signup Error:", error)
      toast.error("Something went wrong!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (isGoogleLoading) return

    setIsGoogleLoading(true)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        additionalData: { role },
      })

      if (error) {
        toast.error(error.message || "Google sign-up failed!")
      }
    } catch (error) {
      console.error("Google Signup Error:", error)
      toast.error("Something went wrong!")
    } finally {
      setIsGoogleLoading(false)
    }

    router.refresh()
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="
      flex min-h-screen items-center
      justify-center px-5 py-10 sm:px-8
    ">
        {/* RIGHT SIDE */}
        <div className="
          flex min-h-screen items-center
          justify-center px-5 py-10 sm:px-8
        ">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link href="/">
                <h1 className="text-3xl font-bold">
                  Smart
                  <span className="
                    bg-gradient-to-r
                    from-blue-500 via-indigo-500 to-purple-500
                    bg-clip-text text-transparent
                  ">
                    Hire
                  </span>
                </h1>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Join SmartHire and discover your next opportunity.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignUp} className="space-y-5">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>

              {/* Account type */}
              <fieldset className="space-y-2">
                <legend className="text-sm leading-none font-medium">
                  I am a...
                </legend>

                <div className="grid gap-2 sm:grid-cols-3">
                  {ROLE_OPTIONS.map((option) => {
                    const isSelected = role === option.value

                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "cursor-pointer rounded-lg border p-3 transition-colors focus-within:ring-2 focus-within:ring-indigo-600/40",
                          isSelected
                            ? "border-indigo-600 bg-indigo-600/5 ring-1 ring-indigo-600"
                            : "border-border hover:bg-muted/60"
                        )}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => setRole(option.value)}
                          className="sr-only"
                        />
                        <span className="block text-sm font-medium">
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="
                  h-11 w-full
                  bg-gradient-to-r
                  from-blue-600 via-indigo-600 to-indigo-700
                  text-white
                  hover:brightness-110
                "
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>

            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs text-muted-foreground">
                OR
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              disabled={isGoogleLoading}
              aria-busy={isGoogleLoading}
              onClick={handleGoogleSignUp}
            >
              <GoogleIcon />
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}

              <Link
                href="/Sign-in"
                className="
                  font-semibold
                  text-indigo-600
                  hover:text-indigo-500
                "
              >
                Sign in
              </Link>
            </p>

            {/* Terms */}
            <p className="
              mt-6 text-center
              text-[11px] leading-5
              text-muted-foreground
            ">
              By creating an account, you agree to SmartHire&apos;s{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>

          </div>
        </div>

      </div>
    </main>
  )
}

/* ============================= */
/* GOOGLE ICON */
/* ============================= */

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 10.023H12v3.955h5.625c-.532 2.532-2.84 4.32-5.625 4.32a6.298 6.298 0 1 1 4.42-10.77l2.83-2.77A10.29 10.29 0 1 0 22.27 12c0-.668-.078-1.34-.465-1.977Z"
        fill="currentColor"
      />
    </svg>
  )
}