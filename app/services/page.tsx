import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: `Services | ${content.business.name}`,
};

export default function ServicesPage() {
  return (
    <>
      <div className="pt-16">
        <div className="py-20 text-center" style={{ background: "var(--color-surface)" }}>
          <div className="max-w-3xl mx-auto px-4">
            <span className="section-badge">What We Offer</span>
            <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              Our Services
            </h1>
            <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Professional services tailored to your specific needs.
            </p>
          </div>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {content.services.map((service, i) => (
              <div
                key={i}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                    style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
                  >
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
                    {service.name}
                  </h2>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
                    {service.description}
                  </p>
                  <Link href="/contact" className="btn-primary">
                    Enquire Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure which service you need?</h2>
          <p className="text-white/80 mb-8">Talk to our team and we&apos;ll help you find the right solution.</p>
          <Link href="/contact" className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>
            Talk to Us
          </Link>
        </div>
      </section>
    </>
  );
}
