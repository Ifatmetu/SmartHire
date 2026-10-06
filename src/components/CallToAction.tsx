import Link from "next/link";

const CTA = () => (
  <section className="bg-gradient-to-r from-[#07142e] via-[#0a1f4d] to-[#0c2a66] py-20">
    <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:px-10">
      <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
        <h3 className="text-2xl font-bold text-white">Looking for a job?</h3>
        <p className="mt-3 text-slate-300">
          Build your profile once and get matched with roles that fit your skills.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Create job seeker account
        </Link>
      </div>

      <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
        <h3 className="text-2xl font-bold text-white">Hiring for your team?</h3>
        <p className="mt-3 text-slate-300">
          Post a job and get a ranked shortlist of qualified candidates.
        </p>
        <Link
          href="/register?role=employer"
          className="mt-6 inline-block rounded-lg border border-sky-400/70 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Post a job
        </Link>
      </div>
    </div>
  </section>
);

export default CTA;