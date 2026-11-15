"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { toast } from "react-toastify"

export default function LoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase()
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || "Sign in failed!")
        return
      }

      toast.success("Signed in successfully!")
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign In Error:", error)
      toast.error("Something went wrong!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return

    setIsGoogleLoading(true)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message || "Google sign-in failed!")
      }
    } catch (error) {
      console.error("Google Sign In Error:", error)
      toast.error("Something went wrong!")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
       <div className="
      flex min-h-screen items-center
      justify-center px-5 py-10 sm:px-8
    ">

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
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to continue to SmartHire.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignIn} className="space-y-5">

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

                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <button
                    type="button"
                    onClick={() =>
                      console.log("Forgot password clicked")
                    }
                    className="
                      text-xs font-medium
                      text-indigo-600
                      hover:text-indigo-500
                    "
                  >
                    Forgot password?
                  </button>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                {isSubmitting ? "Signing in..." : "Sign In"}
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
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}

              <Link
                href="/Sign-up"
                className="
                  font-semibold
                  text-indigo-600
                  hover:text-indigo-500
                "
              >
                Sign up
              </Link>
            </p>

            {/* Terms */}
            <p className="
              mt-6 text-center
              text-[11px] leading-5
              text-muted-foreground
            ">
              By continuing, you agree to SmartHire&apos;s{" "}
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