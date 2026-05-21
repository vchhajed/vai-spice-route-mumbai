"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { auth } from "@/lib/firebase";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
} from "firebase/auth";
import type { SiteContent, Service, Testimonial } from "@/lib/content";

// ─── Types ───────────────────────────────────────────────────────────────────

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

type Tab = "leads" | "analytics" | "editor";
type Device = "desktop" | "mobile";

const STATUS_COLORS: Record<string, string> = {
  new: "#2563eb",
  contacted: "#f59e0b",
  qualified: "#10b981",
  won: "#059669",
  lost: "#ef4444",
};

const SECTIONS = [
  { key: "business", label: "Business Info", hash: "" },
  { key: "hero",     label: "Hero",          hash: "#hero" },
  { key: "about",    label: "About",         hash: "#about" },
  { key: "services", label: "Services",      hash: "#services" },
  { key: "testimonials", label: "Testimonials", hash: "#testimonials" },
  { key: "contact",  label: "Contact",       hash: "#contact" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalisePhone(p: string) {
  return p.replace(/\s+/g, "").replace(/^(\+91|91)/, "+91");
}

function setIn<T>(obj: T, path: (string | number)[], value: unknown): T {
  const next = Array.isArray(obj) ? [...(obj as unknown[])] : { ...(obj as object) };
  const [head, ...rest] = path;
  if (rest.length === 0) {
    (next as Record<string | number, unknown>)[head] = value;
  } else {
    (next as Record<string | number, unknown>)[head] = setIn(
      (obj as Record<string | number, unknown>)[head] as T,
      rest,
      value
    );
  }
  return next as T;
}

// ─── Input helpers ────────────────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-0";
const inputStyle = { borderColor: "#e2e8f0", background: "var(--color-background)" };
const focusRingColor = { "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab]     = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading]   = useState(true);
  const [authed, setAuthed]     = useState(false);
  const [phone, setPhone]       = useState("");
  const [otp, setOtp]           = useState("");
  const [step, setStep]         = useState<"phone" | "otp">("phone");
  const [authError, setAuthError] = useState("");
  const [pageViews, setPageViews] = useState<number>(0);
  const [sending, setSending]   = useState(false);

  const recaptchaRef    = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchLeads = useCallback(async () => {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID;
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });
    setLeads(data ?? []);
  }, [supabase]);

  const fetchAnalytics = useCallback(async () => {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID;
    const { data } = await supabase
      .from("page_views")
      .select("count")
      .eq("site_id", siteId);
    if (data) setPageViews(data.reduce((sum, r) => sum + (r.count ?? 0), 0));
  }, [supabase]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
        if (!adminPhone || normalisePhone(user.phoneNumber ?? "") === normalisePhone(adminPhone)) {
          setAuthed(true);
          fetchLeads();
          fetchAnalytics();
        } else {
          signOut(auth);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchLeads, fetchAnalytics]);

  // Only init RecaptchaVerifier after loading is done and user is not authed
  useEffect(() => {
    if (authed || loading) return;
    const t = setTimeout(() => {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }, 0);
    return () => {
      clearTimeout(t);
      recaptchaRef.current?.clear();
    };
  }, [authed, loading]);

  const sendOtp = async () => {
    setAuthError("");
    setSending(true);
    const normalised = phone.startsWith("+") ? phone : `+91${phone.replace(/\s/g, "")}`;
    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
    if (adminPhone && normalisePhone(normalised) !== normalisePhone(adminPhone)) {
      setAuthError("Access denied. This number is not registered as an admin.");
      setSending(false);
      return;
    }
    try {
      const confirmation = await signInWithPhoneNumber(auth, normalised, recaptchaRef.current!);
      confirmationRef.current = confirmation;
      setPhone(normalised);
      setStep("otp");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Failed to send OTP");
      recaptchaRef.current?.clear();
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
    setSending(false);
  };

  const verifyOtp = async () => {
    setAuthError("");
    setSending(true);
    try {
      const result = await confirmationRef.current!.confirm(otp);
      const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
      if (adminPhone && normalisePhone(result.user.phoneNumber ?? "") !== normalisePhone(adminPhone)) {
        await signOut(auth);
        setAuthError("Access denied. This number is not registered as an admin.");
        setSending(false);
        return;
      }
      setAuthed(true);
      fetchLeads();
      fetchAnalytics();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Invalid OTP");
    }
    setSending(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setAuthed(false);
    setStep("phone");
    setPhone("");
    setOtp("");
  };

  const updateLeadStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  if (loading) {
    return (
      <>
        <div id="recaptcha-container" style={{ display: "none" }} />
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
          <div className="animate-pulse text-lg" style={{ color: "var(--color-text-secondary)" }}>Loading…</div>
        </div>
      </>
    );
  }

  if (!authed) {
    return (
      <>
        <div id="recaptcha-container" style={{ display: "none" }} />
        <LoginForm
          phone={phone} otp={otp} step={step} error={authError} sending={sending}
          setPhone={setPhone} setOtp={setOtp}
          sendOtp={sendOtp} verifyOtp={verifyOtp}
          goBack={() => setStep("phone")} resend={sendOtp}
        />
      </>
    );
  }

  // Editor tab gets full-height layout (no padding wrapper)
  if (tab === "editor") {
    return (
      <div className="flex flex-col" style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b" style={{ borderColor: "#e2e8f0" }}>
          <div className="flex items-center gap-6">
            <span className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
              Admin Dashboard
            </span>
            <div className="flex gap-1">
              {(["leads", "analytics", "editor"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-4 py-1.5 text-sm font-semibold capitalize rounded-lg transition-colors"
                  style={{
                    background: tab === t ? "var(--color-primary)" : "transparent",
                    color: tab === t ? "#fff" : "var(--color-text-secondary)",
                  }}
                >{t}</button>
              ))}
            </div>
          </div>
          <button onClick={handleSignOut} className="text-sm px-3 py-1.5 rounded-lg border"
            style={{ color: "var(--color-text-secondary)", borderColor: "#e2e8f0" }}>
            Sign Out
          </button>
        </div>

        {/* Split pane */}
        <div className="flex flex-1 overflow-hidden">
          <EditorTab />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
            Admin Dashboard
          </h1>
          <button onClick={handleSignOut} className="text-sm px-4 py-2 rounded-lg"
            style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)", border: "1px solid #e2e8f0" }}>
            Sign Out
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: "#e2e8f0" }}>
          {(["leads", "analytics", "editor"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-3 text-sm font-semibold capitalize transition-colors"
              style={{
                borderBottom: tab === t ? `2px solid var(--color-primary)` : "2px solid transparent",
                color: tab === t ? "var(--color-primary)" : "var(--color-text-secondary)",
              }}
            >{t}</button>
          ))}
        </div>

        {tab === "leads"     && <LeadsTab leads={leads} onStatusChange={updateLeadStatus} />}
        {tab === "analytics" && <AnalyticsTab views={pageViews} leads={leads.length} />}
      </div>
    </div>
  );
}

// ─── Visual Editor ────────────────────────────────────────────────────────────

function EditorTab() {
  const [content, setContent]     = useState<SiteContent | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [dirty, setDirty]         = useState(false);
  const [openSection, setOpen]    = useState<string>("hero");
  const [device, setDevice]       = useState<Device>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then((d: SiteContent) => setContent(d));
  }, []);

  const update = (path: (string | number)[], value: unknown) => {
    setContent(prev => prev ? setIn(prev, path, value) : prev);
    setDirty(true);
  };

  const scrollTo = (hash: string) => {
    try {
      if (hash && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.location.hash = hash;
      }
    } catch { /* cross-origin guard */ }
  };

  const openAndScroll = (key: string) => {
    const sec = SECTIONS.find(s => s.key === key);
    setOpen(prev => prev === key ? "" : key);
    if (sec?.hash) scrollTo(sec.hash);
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setDirty(false);
    setIframeKey(k => k + 1);
    setTimeout(() => setSaved(false), 3000);
  };

  // iframe scale for desktop preview
  const SCALE = 0.58;

  return (
    <>
      {/* Preview pane */}
      <div className="flex-1 flex flex-col bg-gray-100 border-r" style={{ borderColor: "#e2e8f0", minWidth: 0 }}>
        {/* Device toggle */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b" style={{ borderColor: "#e2e8f0" }}>
          <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>Preview</span>
          <div className="ml-auto flex rounded-lg overflow-hidden border" style={{ borderColor: "#e2e8f0" }}>
            {(["desktop", "mobile"] as Device[]).map(d => (
              <button key={d} onClick={() => setDevice(d)}
                className="px-3 py-1 text-xs font-semibold transition-colors"
                style={{
                  background: device === d ? "var(--color-primary)" : "#fff",
                  color: device === d ? "#fff" : "var(--color-text-secondary)",
                }}>
                {d === "desktop" ? "🖥 Desktop" : "📱 Mobile"}
              </button>
            ))}
          </div>
          <button onClick={() => setIframeKey(k => k + 1)}
            className="text-xs px-2 py-1 rounded border ml-2"
            style={{ borderColor: "#e2e8f0", color: "var(--color-text-secondary)" }}>
            ↺ Refresh
          </button>
        </div>

        {/* iframe container */}
        <div className="flex-1 overflow-hidden flex items-start justify-center p-4">
          {device === "desktop" ? (
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-white"
              style={{ height: "calc((100vh - 130px) / " + SCALE + ")", transform: `scale(${SCALE})`, transformOrigin: "top center", width: `${100 / SCALE}%` }}>
              <iframe key={iframeKey} ref={iframeRef} src="/" className="w-full h-full border-0" title="Site preview" />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-gray-800"
              style={{ width: 390, height: "calc(100vh - 140px)" }}>
              <iframe key={iframeKey} ref={iframeRef} src="/" className="w-full h-full border-0" title="Site preview" />
            </div>
          )}
        </div>
      </div>

      {/* Editor pane */}
      <div className="flex flex-col bg-white" style={{ width: 400, minWidth: 380 }}>
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#e2e8f0" }}>
          <span className="font-bold text-sm" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
            Edit Website
          </span>
          {dirty && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>
              Unsaved changes
            </span>
          )}
        </div>

        {/* Accordion sections */}
        <div className="flex-1 overflow-y-auto">
          {!content ? (
            <div className="p-6 text-sm text-center animate-pulse" style={{ color: "var(--color-text-secondary)" }}>Loading content…</div>
          ) : (
            SECTIONS.map(sec => (
              <div key={sec.key} className="border-b" style={{ borderColor: "#e2e8f0" }}>
                <button
                  onClick={() => openAndScroll(sec.key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors text-left"
                  style={{ color: openSection === sec.key ? "var(--color-primary)" : "var(--color-text-primary)", background: openSection === sec.key ? "color-mix(in srgb, var(--color-primary) 6%, white)" : "white" }}
                >
                  {sec.label}
                  <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{openSection === sec.key ? "▲" : "▼"}</span>
                </button>

                {openSection === sec.key && (
                  <div className="px-5 pb-5 pt-2 space-y-4">
                    {sec.key === "business" && <BusinessFields c={content} update={update} />}
                    {sec.key === "hero"     && <HeroFields     c={content} update={update} />}
                    {sec.key === "about"    && <AboutFields    c={content} update={update} />}
                    {sec.key === "services" && <ServicesFields c={content} update={update} />}
                    {sec.key === "testimonials" && <TestimonialsFields c={content} update={update} />}
                    {sec.key === "contact"  && <ContactFields  c={content} update={update} />}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Save button */}
        <div className="p-4 border-t bg-white" style={{ borderColor: "#e2e8f0" }}>
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: saved ? "#059669" : "var(--color-primary)",
              color: "#fff",
              opacity: saving || !dirty ? 0.5 : 1,
              cursor: saving || !dirty ? "not-allowed" : "pointer",
            }}
          >
            {saved ? "Saved! Preview refreshed ✓" : saving ? "Saving…" : "Save & Refresh Preview"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Section field components ─────────────────────────────────────────────────

type UpdateFn = (path: (string | number)[], value: unknown) => void;

function BusinessFields({ c, update }: { c: SiteContent; update: UpdateFn }) {
  return (
    <>
      <Field label="Business Name">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.business.name}
          onChange={e => update(["business", "name"], e.target.value)} />
      </Field>
      <Field label="Tagline">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.business.tagline}
          onChange={e => update(["business", "tagline"], e.target.value)} />
      </Field>
      <Field label="Phone">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.business.phone}
          onChange={e => update(["business", "phone"], e.target.value)} />
      </Field>
      <Field label="Email">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.business.email}
          onChange={e => update(["business", "email"], e.target.value)} />
      </Field>
      <Field label="Address">
        <textarea rows={2} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={c.business.address}
          onChange={e => update(["business", "address"], e.target.value)} />
      </Field>
      <Field label="Google Maps URL">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.business.mapUrl}
          placeholder="https://maps.google.com/..." onChange={e => update(["business", "mapUrl"], e.target.value)} />
      </Field>
    </>
  );
}

function HeroFields({ c, update }: { c: SiteContent; update: UpdateFn }) {
  return (
    <>
      <Field label="Headline">
        <textarea rows={2} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={c.hero.headline}
          onChange={e => update(["hero", "headline"], e.target.value)} />
      </Field>
      <Field label="Subheadline">
        <textarea rows={3} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={c.hero.subheadline}
          onChange={e => update(["hero", "subheadline"], e.target.value)} />
      </Field>
      <Field label="Primary Button Text">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.hero.ctaText}
          onChange={e => update(["hero", "ctaText"], e.target.value)} />
      </Field>
      <Field label="Secondary Button Text">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.hero.ctaSecondaryText}
          onChange={e => update(["hero", "ctaSecondaryText"], e.target.value)} />
      </Field>
    </>
  );
}

function AboutFields({ c, update }: { c: SiteContent; update: UpdateFn }) {
  return (
    <>
      <Field label="Badge Text">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.about.badge}
          onChange={e => update(["about", "badge"], e.target.value)} />
      </Field>
      <Field label="Section Title">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.about.title}
          onChange={e => update(["about", "title"], e.target.value)} />
      </Field>
      <Field label="Body Text">
        <textarea rows={4} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={c.about.body}
          onChange={e => update(["about", "body"], e.target.value)} />
      </Field>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-secondary)" }}>Stats</label>
        <div className="space-y-2">
          {c.about.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={stat.value} placeholder="Value"
                onChange={e => update(["about", "stats", i, "value"], e.target.value)} />
              <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={stat.label} placeholder="Label"
                onChange={e => update(["about", "stats", i, "label"], e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ServicesFields({ c, update }: { c: SiteContent; update: UpdateFn }) {
  return (
    <div className="space-y-5">
      {c.services.map((svc: Service, i: number) => (
        <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-surface)", border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2">
            <input className="w-12 px-2 py-2 rounded-lg border text-center text-lg focus:outline-none"
              style={{ borderColor: "#e2e8f0" }} value={svc.icon}
              onChange={e => update(["services", i, "icon"], e.target.value)} />
            <input className={`${inputCls} flex-1`} style={{ ...inputStyle, ...focusRingColor }} value={svc.name} placeholder="Service name"
              onChange={e => update(["services", i, "name"], e.target.value)} />
          </div>
          <textarea rows={2} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={svc.description} placeholder="Description"
            onChange={e => update(["services", i, "description"], e.target.value)} />
        </div>
      ))}
    </div>
  );
}

function TestimonialsFields({ c, update }: { c: SiteContent; update: UpdateFn }) {
  return (
    <div className="space-y-5">
      {c.testimonials.map((t: Testimonial, i: number) => (
        <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-surface)", border: "1px solid #e2e8f0" }}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Name">
              <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={t.name}
                onChange={e => update(["testimonials", i, "name"], e.target.value)} />
            </Field>
            <Field label="Role">
              <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={t.role}
                onChange={e => update(["testimonials", i, "role"], e.target.value)} />
            </Field>
          </div>
          <Field label="Review">
            <textarea rows={3} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={t.text}
              onChange={e => update(["testimonials", i, "text"], e.target.value)} />
          </Field>
        </div>
      ))}
    </div>
  );
}

function ContactFields({ c, update }: { c: SiteContent; update: UpdateFn }) {
  return (
    <>
      <Field label="Section Title">
        <input className={inputCls} style={{ ...inputStyle, ...focusRingColor }} value={c.contact.title}
          onChange={e => update(["contact", "title"], e.target.value)} />
      </Field>
      <Field label="Subtitle">
        <textarea rows={2} className={inputCls} style={{ ...inputStyle, ...focusRingColor, resize: "none" }} value={c.contact.subtitle}
          onChange={e => update(["contact", "subtitle"], e.target.value)} />
      </Field>
    </>
  );
}

// ─── Leads tab ────────────────────────────────────────────────────────────────

function LeadsTab({ leads, onStatusChange }: { leads: Lead[]; onStatusChange: (id: string, status: string) => void }) {
  if (!leads.length) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl">
        <div className="text-4xl mb-4">📭</div>
        <p style={{ color: "var(--color-text-secondary)" }}>No leads yet. Share your website to start collecting enquiries.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {leads.map(lead => (
        <div key={lead.id} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-base" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                {lead.name}
              </div>
              <div className="text-sm mt-1 space-y-1">
                {lead.phone   && <div style={{ color: "var(--color-text-secondary)" }}>📞 {lead.phone}</div>}
                {lead.email   && <div style={{ color: "var(--color-text-secondary)" }}>✉️ {lead.email}</div>}
                {lead.message && <div style={{ color: "var(--color-text-secondary)" }}>💬 {lead.message}</div>}
              </div>
              <div className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
                {new Date(lead.created_at).toLocaleString("en-IN")}
              </div>
            </div>
            <select value={lead.status} onChange={e => onStatusChange(lead.id, e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer border-0"
              style={{
                background: `color-mix(in srgb, ${STATUS_COLORS[lead.status] ?? "#64748b"} 12%, transparent)`,
                color: STATUS_COLORS[lead.status] ?? "#64748b",
              }}>
              {["new", "contacted", "qualified", "won", "lost"].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Analytics tab ────────────────────────────────────────────────────────────

function AnalyticsTab({ views, leads }: { views: number; leads: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: "Total Page Views",  value: views.toLocaleString(), icon: "👁️" },
        { label: "Total Leads",       value: leads.toLocaleString(), icon: "📋" },
        { label: "Conversion Rate",   value: views > 0 ? `${((leads / views) * 100).toFixed(1)}%` : "–", icon: "📈" },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">{stat.icon}</div>
          <div className="text-4xl font-bold mb-1" style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>
            {stat.value}
          </div>
          <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Login form ───────────────────────────────────────────────────────────────

function LoginForm({ phone, otp, step, error, sending, setPhone, setOtp, sendOtp, verifyOtp, goBack, resend }: {
  phone: string; otp: string; step: "phone" | "otp"; error: string; sending: boolean;
  setPhone: (v: string) => void; setOtp: (v: string) => void;
  sendOtp: () => void; verifyOtp: () => void; goBack: () => void; resend: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-surface)" }}>
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
          Admin Login
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "var(--color-text-secondary)" }}>
          {step === "phone" ? "Enter your registered phone number to continue" : `Enter the OTP sent to ${phone}`}
        </p>

        {step === "phone" ? (
          <>
            <input type="tel" placeholder="+91 98765 43210" value={phone}
              onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && sendOtp()}
              className="w-full px-4 py-3 rounded-lg border text-sm mb-4 focus:outline-none"
              style={{ borderColor: "#e2e8f0" }} autoFocus />
            <button onClick={sendOtp} disabled={sending || !phone}
              className="btn-primary w-full text-center" style={{ opacity: sending || !phone ? 0.6 : 1 }}>
              {sending ? "Sending…" : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <button onClick={goBack} className="text-sm mb-4 block"
              style={{ color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer" }}>
              ← {phone}
            </button>
            <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && otp.length === 6 && verifyOtp()}
              className="w-full px-4 py-3 rounded-lg border text-sm mb-4 focus:outline-none"
              style={{ borderColor: "#e2e8f0", letterSpacing: "4px", textAlign: "center" }} autoFocus />
            <button onClick={verifyOtp} disabled={sending || otp.length !== 6}
              className="btn-primary w-full text-center" style={{ opacity: sending || otp.length !== 6 ? 0.6 : 1 }}>
              {sending ? "Verifying…" : "Verify & Sign In"}
            </button>
            <button onClick={resend} className="text-xs mt-3 w-full text-center"
              style={{ color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer" }}>
              Didn&apos;t receive it? Resend
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
