import Head from 'next/head'

interface SEOMetaProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonical?: string
  noIndex?: boolean
}

export default function SEOMeta({
  title = "Google Business Profile Verification Service | Get Verified Fast | Max Market Pros",
  description = "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail. Expert support guaranteed. Call (949) 603-0389.",
  keywords = "Google Business Profile verification, GMB verification, Google My Business verify, business verification service",
  ogImage = "/google-business-verification.png",
  canonical = "https://maxmarketpros.com",
  noIndex = false
}: SEOMetaProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Max Market Pros" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`https://maxmarketpros.com${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Max Market Pros" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://maxmarketpros.com${ogImage}`} />
      <meta name="twitter:site" content="@maxmarketpros" />
      <meta name="twitter:creator" content="@maxmarketpros" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#4285F4" />
      <meta name="msapplication-TileColor" content="#4285F4" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Max Market Pros" />
      
      {/* Business Information */}
      <meta name="business:contact_data:street_address" content="Orange County, CA" />
      <meta name="business:contact_data:locality" content="Orange County" />
      <meta name="business:contact_data:region" content="CA" />
      <meta name="business:contact_data:postal_code" content="92600" />
      <meta name="business:contact_data:country_name" content="United States" />
      <meta name="business:contact_data:phone_number" content="+1-949-603-0389" />
      
      {/* Service Information */}
      <meta name="service:name" content="Google Business Profile Verification" />
      <meta name="service:type" content="Business Verification Service" />
      <meta name="service:price" content="299" />
      <meta name="service:price_currency" content="USD" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  )
}
