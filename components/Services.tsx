import Image from "next/image";
import Link from "next/link";
import { content, type Service } from "@/lib/content";

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-4 left-4 text-3xl">{service.icon}</span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
          {service.name}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {service.description}
        </p>
      </div>
    </div>
  );
}

export default function Services({ preview = false }: { preview?: boolean }) {
  const displayed = preview ? content.services.slice(0, 3) : content.services;

  return (
    <section className="py-24" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-badge">What We Offer</span>
          <h2 className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Our Services
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Explore our range of professional services designed to help your business grow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayed.map((service, i) => (
            <ServiceCard key={i} service={service} />
          ))}
        </div>

        {preview && content.services.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
