import type { Metadata } from "next";
import Contact from "@/components/Contact";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: `Contact | ${content.business.name}`,
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <div className="py-20 text-center" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-badge">Contact Us</span>
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
            {content.contact.title}
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            {content.contact.subtitle}
          </p>
        </div>
      </div>
      <Contact />
    </div>
  );
}
