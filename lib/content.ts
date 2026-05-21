export interface BusinessInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
}

export interface HeroSection {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSecondaryText: string;
  image: string;
}

export interface AboutSection {
  badge: string;
  title: string;
  body: string;
  stats: Array<{ value: string; label: string }>;
  image: string;
}

export interface Service {
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface Testimonial {
  name: string;
  text: string;
  role: string;
  rating: number;
}

export interface ContactSection {
  title: string;
  subtitle: string;
}

export interface FooterSection {
  tagline: string;
  links: Array<{ label: string; href: string }>;
}

export interface Theme {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  headingFont: string;
  bodyFont: string;
}

export interface SiteContent {
  business: BusinessInfo;
  hero: HeroSection;
  about: AboutSection;
  services: Service[];
  testimonials: Testimonial[];
  contact: ContactSection;
  footer: FooterSection;
  theme: Theme;
}

export const content: SiteContent = {
  business: {
    name: "The Spice Route",
    tagline: "Authentic Indian Flavours, Modern Mumbai Soul",
    phone: "+912264001234",
    email: "hello@spiceroute.in",
    address: "Bandra West, Mumbai, Maharashtra",
    mapUrl: "https://maps.google.com/?q=Bandra+West+Mumbai",
  },
  hero: {
    headline: "Authentic North Indian Cuisine Meets Contemporary Mumbai",
    subheadline: "Experience the richness of traditional Mughlai flavours crafted with modern culinary excellence. From our kitchen to your table in minutes.",
    ctaText: "Reserve Your Table",
    ctaSecondaryText: "Order Online",
    image: "/images/hero.jpg",
  },
  about: {
    badge: "About The Spice Route",
    title: "Eight Years of Culinary Excellence and Heritage",
    body: "Since 2016, The Spice Route has been Mumbai's destination for authentic North Indian and Mughlai cuisine. Our warm, rustic ambience blends heritage-inspired design with modern touches, creating the perfect setting for unforgettable dining. We honour traditional recipes while embracing contemporary culinary innovation, serving 80 indoor and 20 outdoor guests daily.",
    stats: [
      { value: "8+", label: "Years Serving Mumbai" },
      { value: "4,200+", label: "Satisfied Diners Monthly" },
      { value: "12", label: "Signature Dishes" },
      { value: "11 Hours", label: "Daily Service" },
    ],
    image: "/images/about.jpg",
  },
  services: [
    {
      name: "Dine-In Experience",
      description: "Savour our signature Butter Chicken and Dal Makhani in an intimate, heritage-inspired setting with warm hospitality and attentive service.",
      icon: "🍽️",
      image: "/images/service-1.jpg",
    },
    {
      name: "Seekh Kebab & Kebab Specialities",
      description: "Tender, charred seekh kebabs grilled to perfection using traditional tandoori techniques and the finest spice blends.",
      icon: "🔥",
      image: "/images/service-2.jpg",
    },
    {
      name: "Biryani Mastery",
      description: "Fragrant, slow-cooked biryanis featuring perfectly basmati rice, tender proteins, and aromatic spices layered with expertise.",
      icon: "🌾",
      image: "/images/service-3.jpg",
    },
    {
      name: "Street Food & Appetizers",
      description: "Authentic Mumbai street food classics paired with modern plating to elevate your traditional favourites.",
      icon: "🥘",
      image: "/images/service-4.jpg",
    },
    {
      name: "Swiggy & Zomato Delivery",
      description: "Order online through Swiggy and Zomato for quick, hot delivery of your favourite dishes straight to your door.",
      icon: "🚗",
      image: "/images/service-5.jpg",
    },
    {
      name: "Outdoor Seating & Events",
      description: "Host intimate gatherings on our charming outdoor terrace with full menu access and personalised service for up to 20 guests.",
      icon: "🌙",
      image: "/images/service-6.jpg",
    },
  ],
  testimonials: [
    {
      name: "Rajesh Mehta",
      text: "The Butter Chicken here is absolutely divine—creamy, rich, and perfectly spiced. We've been coming for years and it never disappoints.",
      role: "Regular Customer",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      text: "The ambience is so warm and rustic. Felt like dining at a heritage palace in the heart of Mumbai. Dal Makhani was heavenly!",
      role: "Food Enthusiast",
      rating: 5,
    },
    {
      name: "Amit Kapoor",
      text: "Ordered biryani through Swiggy three times this month. Quality is consistent, flavours are authentic, and delivery is always on time.",
      role: "Regular Online Orderer",
      rating: 5,
    },
  ],
  contact: {
    title: "Ready to Experience Authentic Flavours?",
    subtitle: "Reserve your table or place an order online. We're open 12pm–3pm and 7pm–11pm daily, serving the finest North Indian and Mughlai cuisine in Bandra.",
  },
  footer: {
    tagline: "The Spice Route: Where Heritage Meets Modern Mumbai Hospitality",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Menu", href: "/menu" },
      { label: "Reservations", href: "/reservations" },
      { label: "Contact", href: "/contact" },
    ],
  },
  theme: {
    primary: "#C56A39",
    primaryDark: "#1d4ed8",
    secondary: "#F5E6D3",
    accent: "#8B2500",
    background: "#ffffff",
    surface: "#f1f5f9",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    headingFont: "Nunito",
    bodyFont: "Lato",
  },
};