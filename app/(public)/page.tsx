import Link from "next/link";

const metrics = [
  { label: "Direct booking share", value: "41.8%" },
  { label: "Net RevPAR", value: "$186" },
  { label: "Occupancy", value: "84.2%" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f3ed] text-[#1d2928]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-semibold tracking-tight">
          hotel growth <span className="font-normal text-zinc-500">/ OS</span>
        </Link>
        <a href="#approach" className="rounded-full border border-zinc-300 px-4 py-2 text-sm">
          Our approach
        </a>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#99452e]">
            Performance infrastructure for independent hotels
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            A clearer operating picture for hotel teams.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            Bring direct bookings, channel costs, and net revenue into one
            property-level view—without exposing guest-level personal data.
          </p>
          <a
            href="#approach"
            className="mt-8 inline-flex rounded-full bg-[#1d2928] px-6 py-3 font-medium text-white"
          >
            Explore the approach
          </a>
        </div>

        <section className="rounded-3xl bg-[#1d2928] p-6 text-white shadow-xl" aria-label="Illustrative hotel metrics">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
            Illustrative property view · rolling 30 days
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/65">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/60">
            Sample figures only; no live hotel systems are connected.
          </p>
        </section>
      </section>

      <section id="approach" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-semibold">Clarity before action.</h2>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
          Understand channel mix and net revenue first. Keep pricing,
          distribution, and campaign decisions under human operator control.
        </p>
      </section>
    </main>
  );
}
