"use client";
import { useState } from "react";
import { content } from "@/lib/content";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/collect-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-24" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="section-badge">Get In Touch</span>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              {content.contact.title}
            </h2>
            <p className="text-lg mb-10" style={{ color: "var(--color-text-secondary)" }}>
              {content.contact.subtitle}
            </p>

            <div className="space-y-6">
              {content.business.phone && (
                <ContactDetail icon="📞" label="Phone" value={content.business.phone} href={`tel:${content.business.phone}`} />
              )}
              {content.business.email && (
                <ContactDetail icon="✉️" label="Email" value={content.business.email} href={`mailto:${content.business.email}`} />
              )}
              {content.business.address && (
                <ContactDetail icon="📍" label="Address" value={content.business.address} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {status === "success" ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Message Sent!</h3>
                <p style={{ color: "var(--color-text-secondary)" }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold mb-6" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                  Send Us a Message
                </h3>
                <FormField label="Your Name" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--color-surface)", background: "var(--color-surface)" }}
                  />
                </FormField>
                <FormField label="Phone Number" required>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--color-surface)", background: "var(--color-surface)" }}
                  />
                </FormField>
                <FormField label="Email Address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--color-surface)", background: "var(--color-surface)" }}
                  />
                </FormField>
                <FormField label="How can we help?">
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your requirements..."
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: "var(--color-surface)", background: "var(--color-surface)" }}
                  />
                </FormField>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full text-center"
                  style={{ opacity: status === "loading" ? 0.7 : 1 }}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                {status === "error" && (
                  <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactDetail({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-secondary)" }}>
          {label}
        </div>
        <div className="font-medium" style={{ color: "var(--color-text-primary)" }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:opacity-80 transition-opacity">{inner}</a> : <div>{inner}</div>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
