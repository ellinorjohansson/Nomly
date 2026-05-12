"use client";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="bg-primary border-b border-secondary sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold text-primaryaccent">
            Nomly
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-secondaryaccent hover:text-primaryaccent transition"
          >
            Home
          </Link>
          <Link
            href="/recipes"
            className="text-secondaryaccent hover:text-primaryaccent transition"
          >
            Recipes
          </Link>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-secondaryaccent hover:text-primaryaccent transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primaryaccent text-primary rounded-lg hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden text-primaryaccent"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isNavOpen && (
        <nav className="md:hidden bg-secondary border-t border-primaryaccent/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className="text-secondaryaccent hover:text-primaryaccent transition"
              onClick={() => setIsNavOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/recipes"
              className="text-secondaryaccent hover:text-primaryaccent transition"
              onClick={() => setIsNavOpen(false)}
            >
              Recipes
            </Link>
            <Link
              href="/login"
              className="text-secondaryaccent hover:text-primaryaccent transition"
              onClick={() => setIsNavOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primaryaccent text-primary rounded-lg hover:opacity-90 transition text-center"
              onClick={() => setIsNavOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
