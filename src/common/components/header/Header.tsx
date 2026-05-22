"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface HeaderSessionUser {
  userId: string;
  name: string;
  email: string;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<HeaderSessionUser | null>(
    null,
  );
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setIsSessionLoading(true);

      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const payload = await response.json().catch(() => null);

        if (!isMounted) {
          return;
        }

        if (response.ok && payload?.success) {
          setSessionUser(payload.data?.user ?? null);
        } else {
          setSessionUser(null);
        }
      } catch {
        if (isMounted) {
          setSessionUser(null);
        }
      } finally {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!showLogoutToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowLogoutToast(false);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showLogoutToast]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setSessionUser(null);
      setIsNavOpen(false);
      setShowLogoutToast(true);
      setIsLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="bg-primary border-b border-secondary sticky top-0 z-50">
      {showLogoutToast && (
        <div className="pointer-events-none fixed right-4 top-20 z-60 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-xl">
          <p className="text-sm font-medium text-primaryaccent">
            Du har loggats ut.
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h2 className="text-2xl font-logo font-bold">Nomly</h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/recipes"
            className="text-secondaryaccent hover:text-primaryaccent transition"
          >
            Recept
          </Link>
          <Link
            href="/shopping-list"
            className="text-secondaryaccent hover:text-primaryaccent transition"
          >
            Inköpslista
          </Link>
          {!isSessionLoading && (
            <div className="flex items-center gap-3">
              {sessionUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label="Logga ut"
                  title="Logga ut"
                  className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-full border border-primaryaccent/15 text-primaryaccent transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    logout
                  </span>
                </button>
              ) : (
                <>
                  <Link
                    href="/login?next=%2Frecipes"
                    className="px-4 py-2 text-secondaryaccent hover:text-primaryaccent transition"
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/signup?next=%2Frecipes"
                    className="px-4 py-2 bg-primaryaccent text-primary rounded-lg hover:opacity-90 transition"
                  >
                    Kom igång
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden text-primaryaccent"
          aria-label="Växla meny"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isNavOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 6l12 12M6 18L18 6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isNavOpen && (
        <nav className="md:hidden bg-secondary border-t border-primaryaccent/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-6">
            <Link
              href="/"
              className="text-secondaryaccent hover:text-primaryaccent transition"
              onClick={() => setIsNavOpen(false)}
            >
              Hem
            </Link>
            <Link
              href="/recipes"
              className="text-secondaryaccent hover:text-primaryaccent transition"
              onClick={() => setIsNavOpen(false)}
            >
              Recept
            </Link>
            <Link
              href="/shopping-list"
              className="text-secondaryaccent hover:text-primaryaccent transition"
              onClick={() => setIsNavOpen(false)}
            >
              Inköpslista
            </Link>
            {!isSessionLoading &&
              (sessionUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center text-left text-secondaryaccent transition hover:text-primaryaccent disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Logga ut
                </button>
              ) : (
                <>
                  <Link
                    href="/login?next=%2Frecipes"
                    className="text-secondaryaccent hover:text-primaryaccent transition"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/signup?next=%2Frecipes"
                    className="px-4 py-2 bg-primaryaccent text-primary rounded-lg hover:opacity-90 transition text-center"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Skapa konto
                  </Link>
                </>
              ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
