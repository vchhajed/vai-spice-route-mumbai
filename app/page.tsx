import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <div id="hero"><Hero /></div>
      <div id="about"><About compact /></div>
      <div id="services"><Services preview /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="contact"><Contact /></div>
    </>
  );
}
