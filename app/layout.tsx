import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/* VAI_METADATA_INJECT */
export const metadata: Metadata = {
  title: "The Spice Route | Food & Beverage",
  description: "Authentic Indian Flavours, Modern Mumbai Soul",
};
/* VAI_METADATA_INJECT_END */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
