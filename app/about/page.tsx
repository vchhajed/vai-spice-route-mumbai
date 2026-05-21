import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: `About | ${content.business.name}`,
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-16">
        <div
          className="py-20 text-center"
          style={{ background: "var(--color-surface)" }}
        >
          <div className="max-w-3xl mx-auto px-4">
            <span className="section-badge">{content.about.badge}</span>
            <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              {content.about.title}
            </h1>
            <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
              {content.about.body}
            </p>
          </div>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image src={content.about.image} alt="About us" fill className="object-cover" />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {content.about.stats.map((s, i) => (
                  <div key={i} className="p-6 rounded-2xl text-center" style={{ background: "var(--color-surface)" }}>
                    <div className="text-4xl font-bold mb-1" style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>
                      {s.value}
                    </div>
                    <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-text-secondary)" }}>
                {content.about.body}
              </p>
              <Link href="/contact" className="btn-primary">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to work with us?</h2>
          <p className="text-white/80 mb-8">{content.contact.subtitle}</p>
          <Link href="/contact" className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  );
}
