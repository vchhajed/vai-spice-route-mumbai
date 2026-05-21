import Link from "next/link";
import { content } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--color-text-primary)", color: "rgba(255,255,255,0.7)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="font-bold text-xl text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              {content.business.name}
            </div>
            <p className="text-sm leading-relaxed mb-4">{content.footer.tagline}</p>
            {content.business.phone && (
              <a href={`tel:${content.business.phone}`} className="text-sm hover:text-white transition-colors block">
                {content.business.phone}
              </a>
            )}
            {content.business.email && (
              <a href={`mailto:${content.business.email}`} className="text-sm hover:text-white transition-colors block">
                {content.business.email}
              </a>
            )}
          </div>

          <div>
            <div className="font-semibold text-white text-sm uppercase tracking-wide mb-4">Quick Links</div>
            <ul className="space-y-2">
              {content.footer.links.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white text-sm uppercase tracking-wide mb-4">Get In Touch</div>
            <p className="text-sm mb-4">{content.business.address}</p>
            <Link href="/contact" className="btn-primary text-sm">
              Contact Us
            </Link>
          </div>
        </div>

        <div
          className="pt-8 text-xs text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          © {year} {content.business.name}. All rights reserved. Powered by{" "}
          <a href="https://tryv.ai" className="hover:text-white transition-colors">vAI</a>.
        </div>
      </div>
    </footer>
  );
}
