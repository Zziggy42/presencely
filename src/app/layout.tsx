import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presencely — Local Business Dashboard",
  description: "See exactly how your online presence translates to revenue. Google Maps, reviews, SEO, staffing — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
