"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import logo from "@/app/images/logo.png";
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Menu,
  ChevronDown,
  Briefcase,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "@/lib/auth-client"

const COMPANY_LINKS = [
  {
    title: "About SmartHire",
    description: "Our mission to revolutionize hiring with AI matching.",
    href: "/about",
    icon: Building2,
  },
  {
    title: "Careers",
    description: "Join our fast-growing global engineering and product team.",
    href: "/careers",
    icon: Briefcase,
    badge: "We're hiring",
  },
  {
    title: "Community & Mentorship",
    description: "Connect with industry leaders, hiring managers, and peers.",
    href: "/community",
    icon: Users,
  },
  {
    title: "AI Talent Match",
    description: "Learn how our automated matching algorithm discovers talent.",
    href: "/ai-match",
    icon: Sparkles,
  },
]

const emptySubscribe = () => () => {}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const { data: session, isPending } = useSession()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleSignOut = async () => {
    await signOut()
    setMobileOpen(false)
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-95"
            aria-label="SmartHire Home"
          >
            <div className="relative flex items-center justify-center">
              <Image
                src={logo}
                alt="Smart Hire"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (shadcn based) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/jobs"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground",
                pathname === "/jobs" && "bg-accent text-foreground font-semibold"
              )}
            >
              Browse Jobs
            </Link>

            {/* shadcn DropdownMenu for Company */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                )}
              >
                <span>Company</span>
                <ChevronDown className="size-3.5 opacity-70 transition-transform duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2">
                {COMPANY_LINKS.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} className="p-0 hover:bg-accent/60">
                      <Link
                        href={item.href}
                        className="flex w-full items-start gap-3 rounded-lg p-2.5 transition-colors"
                      >
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-secondary/60 text-foreground">
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground",
                pathname === "/pricing" && "bg-accent text-foreground font-semibold"
              )}
            >
              Pricing
            </Link>
            <Link
              href={`/dashboard/${session?.user?.role || 'seeker'}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground",
                pathname === `/dashboard/${session?.user?.role || 'seeker'}` && "bg-accent text-foreground font-semibold"
              )}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right: Actions, Theme Toggle & CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* shadcn Button for Theme Toggle */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="size-9 rounded-lg border-border/60"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="size-4 rotate-0 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="size-4 rotate-0 transition-transform hover:-rotate-12" />
              )}
            </Button>
          )}

          {/* Divider Line */}
          <div className="h-5 w-px bg-border/60" aria-hidden="true" />

          {/* Auth Actions */}
          {isPending ? (
            <div
              className="h-8 w-36 animate-pulse rounded-lg bg-muted"
              aria-hidden="true"
            />
          ) : session?.user ? (
            <>
              <span className="max-w-[18ch] truncate text-sm font-medium text-muted-foreground">
                Welcome,{" "}
                {session.user.name || session.user.email || "User"}!
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/Sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                Sign In
              </Link>

              {/* Primary Get Started Button */}
              <Link
                href="/Sign-up"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "group gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-4 py-2 font-medium text-white shadow-md shadow-indigo-600/20 hover:brightness-110 active:scale-[0.98]"
                )}
              >
                <span>Get Started</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Controls (Theme & shadcn Sheet Drawer) */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="size-9"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          )}

          {/* shadcn Sheet for Mobile Navigation */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-9 cursor-pointer"
              )}
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/images/logo.png"
                      alt="SmartHire Logo"
                      width={130}
                      height={36}
                      className="h-8 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Links */}
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/jobs"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start text-base font-medium px-3",
                      pathname === "/jobs" && "bg-accent font-semibold"
                    )}
                  >
                    Browse Jobs
                  </Link>

                  <div className="py-2 pl-3 space-y-1 border-l-2 border-border/60 ml-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                      Company
                    </span>
                    {COMPANY_LINKS.map((subItem) => {
                      const Icon = subItem.icon
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          <Icon className="size-3.5" />
                          <span>{subItem.title}</span>
                          {subItem.badge && (
                            <span className="ml-auto rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-500">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>

                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start text-base font-medium px-3",
                      pathname === "/pricing" && "bg-accent font-semibold"
                    )}
                  >
                    Pricing
                  </Link>
                </div>
              </div>

              {/* Mobile Auth Actions */}
              <div className="space-y-2.5 pt-6 border-t border-border/60">
                {isPending ? (
                  <div
                    className="h-9 w-full animate-pulse rounded-lg bg-muted"
                    aria-hidden="true"
                  />
                ) : session?.user ? (
                  <>
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      Signed in as{" "}
                      {session.user.name || session.user.email || "User"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full justify-center"
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/Sign-in"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center"
                      )}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/Sign-up"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full justify-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20"
                      )}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
