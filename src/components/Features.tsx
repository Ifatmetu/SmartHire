const features = [
  { icon: "✦", title: "Jobs that fit you", text: "See roles picked for your skills and experience, so you spend less time searching." },
  { icon: "▤", title: "Know what to learn next", text: "Find out which skills can get you closer to the job you want." },
  { icon: "⚡", title: "Apply in seconds", text: "Use your saved profile to apply without filling long forms again." },
  { icon: "◎", title: "Hire faster", text: "Get a shortlist of qualified candidates instead of hundreds of resumes." },
];

const Features = () => (
  <section className="bg-gray-50 py-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Hiring, made simple</h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
              {f.icon}
            </div>
            <h3 className="mt-5 font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;