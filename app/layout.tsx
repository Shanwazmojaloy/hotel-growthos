import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hotel Growth OS — concept preview",
    template: "%s · Hotel Growth OS",
  },
  description:
    "An early product concept for a clearer operating view of hotel performance. Placeholder copy; no live hotel systems are connected.",
  robots: {
    index: false,
    follow: false,
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
