import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indrani Inapakolla – AI Clone",
  description:
    "Chat with Indrani's AI clone. Ask about her projects, skills, and experience as a Full Stack Engineer.",
  openGraph: {
    title: "Indrani Inapakolla – AI Clone",
    description: "Chat with Indrani's AI clone",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%' }}>{children}</body>
    </html>
  );
}
