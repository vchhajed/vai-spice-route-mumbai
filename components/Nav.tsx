"use client";
import { useState } from "react";
import Link from "next/link";
import { content } from "@/lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav
      style={{ borderBottom: "1px solid var(--color-surface)" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading font-bold text-xl" style={{ color: "var(--color-primary)" }}>
            {content.business.name}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors hover:text-[var(--color-primary)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary text-sm py-2 px-5">
              {content.hero.ctaText}
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-sm font-medium py-2"
              style={{ color: "var(--color-text-primary)" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary text-sm block text-center mt-2" onClick={() => setOpen(false)}>
            {content.hero.ctaText}
          </Link>
        </div>
      )}
    </nav>
  );
}
