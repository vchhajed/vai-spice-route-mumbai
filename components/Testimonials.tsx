import { content } from "@/lib/content";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "var(--color-accent)" }}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24" style={{ background: "var(--color-background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-badge">Testimonials</span>
          <h2 className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            What Our Clients Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl"
              style={{ background: "var(--color-surface)" }}
            >
              <Stars count={t.rating} />
              <p
                className="text-base leading-relaxed mb-6 italic"
                style={{ color: "var(--color-text-secondary)" }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "var(--color-primary)" }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
