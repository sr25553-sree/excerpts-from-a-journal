interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-[65ch] px-6 py-12 md:py-20">
      <header className="mb-16">
        <nav className="flex items-baseline justify-between">
          <a
            href="/"
            className="font-serif text-lg font-semibold tracking-tight text-ink no-underline hover:text-accent transition-colors duration-300"
          >
            Excerpts from a Journal
          </a>
          <a
            href="/write"
            className="font-sans text-sm text-ink-faint no-underline hover:text-ink transition-colors duration-300"
          >
            write something
          </a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t border-rule pt-8 text-center font-sans text-xs text-ink-faint">
        anonymous words, left here for anyone
      </footer>
    </div>
  );
}
