import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 z-0">
        <Image
          src={content.hero.image}
          alt={content.business.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <p className="section-badge mb-6" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            {content.business.tagline}
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ color: "#fff", fontFamily: "var(--font-heading)" }}
          >
            {content.hero.headline}
          </h1>
          <p className="text-lg sm:text-xl mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            {content.hero.subheadline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary text-base">
              {content.hero.ctaText}
            </Link>
            <Link
              href="/about"
              className="btn-outline text-base"
              style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}
            >
              {content.hero.ctaSecondaryText}
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-8">
            {content.about.stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold" style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>
                  {s.value}
                </div>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
