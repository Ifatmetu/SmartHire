"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import globe from "@/app/images/globe.png";
const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "DevOps Engineer",
]

// Search Icon
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

// Location Icon
function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

// Briefcase Icon
function BriefcaseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  )
}

// Stats data
const stats = [
  {
    value: "50K",
    label: "Active Jobs",
  },
  {
    value: "12K",
    label: "Companies",
  },
  {
    value: "2M",
    label: "Job Seekers",
  },
  {
    value: "97%",
    label: "Satisfaction Rate",
  },
]

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#0b0709] text-white">

      {/* ===================================================== */}
      {/* BACKGROUND STRIPES */}
      {/* ===================================================== */}

      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(52, 31, 34, 0.85) 0px,
              rgba(52, 31, 34, 0.85) 42px,
              rgba(8, 8, 10, 0.95) 42px,
              rgba(8, 8, 10, 0.95) 58px
            )
          `,
        }}
      />

      {/* ===================================================== */}
      {/* DARK RADIAL OVERLAY */}
      {/* ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(11, 7, 9, 0.05) 0%,
              rgba(11, 7, 9, 0.25) 35%,
              rgba(11, 7, 9, 0.85) 82%,
              rgba(11, 7, 9, 1) 100%
            )
          `,
        }}
      />

      {/* ===================================================== */}
      {/* TOP DARK GRADIENT */}
      {/* ===================================================== */}

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />

      {/* ===================================================== */}
      {/* PURPLE / BLUE GLOW BEHIND EARTH */}
      {/* ===================================================== */}

      <div
        className="
          absolute
          bottom-[120px]
          left-1/2
          h-[300px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-indigo-600/20
          blur-[100px]
        "
      />

      {/* ===================================================== */}
      {/* SMALL LIGHT DOTS */}
      {/* ===================================================== */}

      <div className="absolute bottom-[190px] left-[18%] size-1 rounded-full bg-indigo-400/60" />
      <div className="absolute bottom-[250px] right-[21%] size-1 rounded-full bg-purple-400/60" />
      <div className="absolute bottom-[150px] right-[32%] size-1 rounded-full bg-indigo-400/50" />
      <div className="absolute bottom-[310px] left-[30%] size-[3px] rounded-full bg-purple-400/50" />

      {/* ===================================================== */}
      {/* EARTH IMAGE */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute bottom-[-185px] left-1/2 z-[1] w-[760px] -translate-x-1/2 sm:bottom-[-210px] sm:w-[900px] lg:bottom-[-245px] lg:w-[1050px]">

        {/* Purple glow around Earth */}
        <div className="absolute -inset-10 rounded-full bg-indigo-600/20 blur-[70px]" />

        <Image
          src={globe}
          alt="Earth"
          width={1200}
          height={700}
          priority
          className="
            relative
            h-auto
            w-full
            object-contain
            opacity-90
            drop-shadow-[0_-10px_50px_rgba(99,102,241,0.35)]
          "
        />
      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-6xl
          flex-col
          items-center
          px-5
          pt-20
          text-center
          sm:pt-24
          lg:pt-28
        "
      >

        {/* ================================================= */}
        {/* JOB BADGE */}
        {/* ================================================= */}

        <div
          className="
            mb-6
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.05]
            px-4
            py-2
            text-xs
            text-white/60
            shadow-lg
            backdrop-blur-md
          "
        >
          <span className="text-orange-400">
            <BriefcaseIcon />
          </span>

          <span className="font-semibold text-white">
            50,000+
          </span>

          <span>
            NEW JOBS THIS MONTH
          </span>
        </div>

        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <h1
          className="
            max-w-3xl
            text-4xl
            font-bold
            tracking-tight
            text-white
            sm:text-5xl
            lg:text-[54px]
            lg:leading-[1.05]
          "
        >
          Find Your Dream Job{" "}

          <span
            className="
              bg-gradient-to-r
              from-blue-400
              via-indigo-400
              to-purple-400
              bg-clip-text
              text-transparent
            "
          >
            Today
          </span>
        </h1>

        {/* ================================================= */}
        {/* DESCRIPTION */}
        {/* ================================================= */}

        <p
          className="
            mt-5
            max-w-2xl
            text-sm
            leading-6
            text-white/45
            sm:text-base
          "
        >
          SmartHire connects top talent with world-class companies.
          Browse thousands of curated opportunities and land your
          next role — faster.
        </p>

        {/* ================================================= */}
        {/* SEARCH BOX */}
        {/* ================================================= */}

        <form
          action="/jobs"
          method="GET"
          className="
            mt-8
            flex
            w-full
            max-w-[680px]
            flex-col
            gap-2
            rounded-xl
            border
            border-white/10
            bg-black/30
            p-1.5
            shadow-2xl
            backdrop-blur-xl
            sm:flex-row
            sm:items-center
          "
        >

          {/* JOB SEARCH */}

          <div className="flex flex-1 items-center gap-2 px-3">

            <span className="shrink-0 text-white/45">
              <SearchIcon />
            </span>

            <input
              type="text"
              name="q"
              placeholder="Job title, skill or company"
              className="
                h-10
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-white/35
              "
            />

          </div>

          {/* DIVIDER */}

          <div className="hidden h-7 w-px bg-white/10 sm:block" />

          {/* LOCATION */}

          <div className="flex flex-1 items-center gap-2 px-3">

            <span className="shrink-0 text-white/45">
              <LocationIcon />
            </span>

            <input
              type="text"
              name="location"
              placeholder="Location or Remote"
              className="
                h-10
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-white/35
              "
            />

          </div>

          {/* SEARCH BUTTON */}

          <Button
            type="submit"
            size="icon"
            className="
              size-10
              shrink-0
              rounded-lg
              bg-indigo-600
              text-white
              shadow-lg
              shadow-indigo-600/30
              hover:bg-indigo-500
            "
          >
            <SearchIcon />
          </Button>

        </form>

        {/* ================================================= */}
        {/* TRENDING POSITIONS */}
        {/* ================================================= */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

          <span className="mr-1 text-xs text-white/35">
            Trending Position
          </span>

          {trendingPositions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => {
                router.push(`/jobs?q=${encodeURIComponent(position)}`)
              }}
              className="
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                px-3
                py-1.5
                text-[11px]
                text-white/50
                transition
                hover:border-indigo-500/50
                hover:bg-indigo-500/10
                hover:text-white
              "
            >
              {position}
            </button>
          ))}

        </div>

      </div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-1/2
          z-20
          w-full
          max-w-6xl
          -translate-x-1/2
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            grid
            grid-cols-2
            overflow-hidden
            rounded-t-lg
            border
            border-white/10
            bg-black/55
            backdrop-blur-xl
            md:grid-cols-4
          "
        >

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                relative
                px-5
                py-5
                text-left
                sm:px-7
                sm:py-6
                ${index !== 0 ? "border-l border-white/10" : ""}
                ${index >= 2 ? "border-t border-white/10 md:border-t-0" : ""}
              `}
            >

              {/* small top icon/dot */}
              <div className="mb-3 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-indigo-400" />

                <div className="h-px w-8 bg-white/10" />
              </div>

              <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {stat.value}
              </div>

              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/35 sm:text-xs">
                {stat.label}
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  )
}