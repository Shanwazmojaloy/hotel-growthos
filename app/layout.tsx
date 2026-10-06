import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hotel Growth OS — Direct Channel & Hospitality Architecture",
    template: "%s · Hotel Growth OS",
  },
  description:
    "A unified operating system for independent and boutique hotels. Elevating direct bookings, channel distribution, and net revenue clarity.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
