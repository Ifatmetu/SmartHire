import Link from "next/link";

const jobs = [
  { title: "Frontend Developer", company: "Pathao", location: "Dhaka · Hybrid", type: "Full-time", match: 94 },
  { title: "Data Analyst", company: "bKash", location: "Dhaka · On-site", type: "Full-time", match: 88 },
  { title: "UI/UX Designer", company: "Shohoz", location: "Remote", type: "Contract", match: 81 },
];

const FeaturedJobs = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Jobs matched for you</h2>
        <Link href="/jobs" className="text-sm font-semibold text-blue-600 hover:underline">
          View all jobs
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.title}
            className="rounded-2xl border border-gray-200 p-6 transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{job.company}</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {job.match}% match
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-500">{job.location} · {job.type}</p>

            <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
              <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${job.match}%` }} />
            </div>

            <Link href="/jobs" className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:underline">
              Apply now
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedJobs;