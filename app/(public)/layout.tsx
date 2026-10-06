import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner page-container">
          <Link className="brand" href="/" aria-label="Hotel Growth OS home">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="brand-wordmark">
              <strong>hotel growth</strong>
              <span>operating system</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/#product">Architecture</Link>
            <Link href="/contact">Contact</Link>
            <Link className="nav-operator" href="/ops">
              Operator sign in <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="page-container site-footer__inner">
          <Link className="footer-brand" href="/">
            Hotel Growth OS
          </Link>
          <p>Hotel Growth OS · Direct Channel Operating Architecture · Confidential & Property-Isolated</p>
          <span>Direct Channel & Growth Architecture</span>
        </div>
      </footer>
    </>
  );
}
