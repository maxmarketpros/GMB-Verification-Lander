import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import StructuredData from "@/components/structured-data"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://maxmarketpros.com'),
  title: "Google Business Profile Verification Service | Get Verified Fast | Max Market Pros",
  description:
    "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail. Expert support guaranteed. Call (949) 603-0389.",
  keywords: [
    "Google Business Profile verification",
    "GMB verification",
    "Google My Business verify",
    "business verification service",
    "Google verification help",
    "verify business on Google",
    "Google Maps verification",
    "Google Business Profile suspended",
    "GMB suspension help",
    "business listing verification",
    "Google verification postcard",
    "Google Business Profile reinstatement",
    "local SEO verification",
    "Google My Business support",
    "business verification experts",
    "Google Business Profile optimization",
    "local business verification",
    "Google verification service",
    "business listing management",
    "Google Business Profile recovery"
  ].join(', '),
  authors: [{ name: "Max Market Pros", url: "https://maxmarketpros.com" }],
  creator: "Max Market Pros",
  publisher: "Max Market Pros",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://maxmarketpros.com',
  },
  category: 'Business Services',
  classification: 'Google Business Profile Verification',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Google Business Profile Verification Service | Get Verified Fast",
    description:
      "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail. Expert support guaranteed.",
    type: "website",
    locale: "en_US",
    url: "https://maxmarketpros.com",
    siteName: "Max Market Pros",
    images: [
      {
        url: '/google-business-verification.png',
        width: 1200,
        height: 630,
        alt: 'Google Business Profile Verification Service',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Business Profile Verification Service | Get Verified Fast",
    description:
      "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail.",
    images: ['/google-business-verification.png'],
    creator: "@maxmarketpros",
    site: "@maxmarketpros",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "your-bing-verification-code",
    "yandex-verification": "your-yandex-verification-code",
    "alexaVerifyID": "your-alexa-verification-code",
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
