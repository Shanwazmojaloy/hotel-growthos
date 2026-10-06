import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__inner page-container">
        <span className="not-found-page__code" aria-hidden="true">
          404
        </span>
        <h1>Page not found</h1>
        <p>
          The page you are looking for may have moved or no longer exists.
          Return to the home page to continue exploring Hotel Growth OS.
        </p>
        <div className="not-found-page__actions">
          <Link className="button button-primary" href="/">
            Back to home <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" href="/contact">
            Contact us <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </main>
  );
}