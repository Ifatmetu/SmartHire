import React from "react";
import Image from "next/image";
import Link from "next/link";
import BannerImage from "@/assets/Banner.png";

const chips = [
  { label: "AI Matching", icon: "✦", position: "top-6 left-2 sm:-left-4" },
  { label: "Skill Analysis", icon: "▤", position: "top-20 right-2 sm:-right-4" },
  { label: "Better Opportunities", icon: "★", position: "top-40 left-0 sm:-left-8" },
];

const Banner = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#07142e] via-[#0a1f4d] to-[#0c2a66]">
      <div className="mx-auto flex min-h-[520px] max-w-7xl items-center justify-between gap-10 px-6 py-16 lg:px-10">
        {/* Left Content */}
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Smarter Hiring,
            <br />
            <span className="text-sky-400">Better Tomorrow</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
            AI-powered recruitment platform that connects job seekers with the
            right opportunities and helps employers find the best talent.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/jobs"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Find Jobs
            </Link>

            <Link
              href="/candidates"
              className="rounded-lg border border-sky-400/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Find Candidates
            </Link>
          </div>
        </div>

        {/* Right Image + Floating Chips */}
        <div className="relative hidden w-full max-w-xl lg:block">
          <Image
            src={BannerImage}
            alt="SmartHire AI Recruitment"
            width={600}
            height={500}
            priority
            className="h-auto w-full rounded-2xl object-contain"
          />

          {chips.map((chip) => (
            <div
              key={chip.label}
              className={`absolute flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg ${chip.position}`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white">
                {chip.icon}
              </span>
              {chip.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;