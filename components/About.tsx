import Image from "next/image";
import { content } from "@/lib/content";

export default function About({ compact = false }: { compact?: boolean }) {
  return (
    <section className="py-24" style={{ background: "var(--color-background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
              style={{ background: "color-mix(in srgb, var(--color-primary) 8%, transparent)" }}
            />
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={content.about.image}
                alt="About us"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <span className="section-badge">{content.about.badge}</span>
            <h2 className="text-4xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
              {content.about.title}
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {content.about.body}
            </p>

            {!compact && (
              <div className="grid grid-cols-2 gap-6">
                {content.about.stats.map((s, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl"
                    style={{ background: "var(--color-surface)" }}
                  >
                    <div
                      className="text-3xl font-bold mb-1"
                      style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
