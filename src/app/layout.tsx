import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Hostel Dudes – Find PG Near Your College",
    template: "%s | Hostel Dudes",
  },
  description:
    "Discover verified PG accommodations near your college or university. Filter by budget, gender, amenities, and distance. Hostel Dudes makes finding your perfect paying guest stay simple.",
  keywords: [
    "PG near college",
    "paying guest accommodation",
    "student PG",
    "PG finder",
    "hostel for students",
    "Hostel Dudes",
  ],
  authors: [{ name: "Hostel Dudes" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://hostelsdudes.in",
    siteName: "Hostel Dudes",
    title: "Hostel Dudes – Find PG Near Your College",
    description:
      "Find verified, affordable PG accommodations near your college. Compare prices, amenities, and reviews.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hostel Dudes – Find PG Near Your College",
    description: "Find verified PG accommodations near your college.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
