import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Report Issues Instantly',
    description: 'Submit complaints about electrical, plumbing, internet, or any campus issue in seconds, with photo evidence.',
  },
  {
    title: 'Track Every Step',
    description: 'Follow your complaint from submission to resolution with a live status timeline.',
  },
  {
    title: 'Get It Fixed Fast',
    description: 'Staff are notified and assigned automatically, so issues get resolved without the back-and-forth.',
  },
];

const roles = [
  {
    title: 'Students',
    description: 'Report issues, track progress, and get updates in real time.',
  },
  {
    title: 'Staff',
    description: 'View assigned complaints, update status, and resolve issues efficiently.',
  },
  {
    title: 'Admins',
    description: 'Manage users, assign complaints, and monitor campus-wide analytics.',
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-primary sm:text-lg sm:tracking-[0.3em]">
            CampusCare
          </p>
          <div className="flex gap-2 sm:gap-3">
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:text-text-primary sm:px-4"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary-dark sm:px-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-4 text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
          Campus issues, resolved faster.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-text-secondary">
          CampusCare connects students, staff, and administrators in one place to report, track, and
          fix campus issues — from broken lights to plumbing problems.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            Report an Issue
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-primary transition hover:bg-surface"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-semibold text-text-primary">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-text-primary">
            Built for everyone on campus
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.title}
                className="rounded-xl border border-border bg-background p-6 text-center shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold text-primary">{role.title}</h3>
                <p className="text-sm text-text-secondary">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Ready to get started?</h2>
        <p className="mb-6 text-text-secondary">
          Join CampusCare today and help make your campus better, one fix at a time.
        </p>
        <Link
          to="/register"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          Create Your Account
        </Link>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} CampusCare. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;