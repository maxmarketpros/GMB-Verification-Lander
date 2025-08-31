import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

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
  title: "Google Business Profile Verification Service | Get Verified Fast",
  description:
    "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail. Expert support guaranteed. Call (949) 603-0389.",
  keywords:
    "Google Business Profile verification, GMB verification, Google My Business verify, business verification service, Google verification help, verify business on Google, Google Maps verification",
  authors: [{ name: "Max Market Pros" }],
  creator: "Max Market Pros",
  publisher: "Max Market Pros",
  robots: "index, follow",
  openGraph: {
    title: "Google Business Profile Verification Service | Get Verified Fast",
    description:
      "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Business Profile Verification Service | Get Verified Fast",
    description:
      "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail.",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
