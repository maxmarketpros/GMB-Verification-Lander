import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Max Market Pros",
    "description": "Professional Google Business Profile verification service. Get your business verified on Google Search and Maps when postcards fail.",
    "url": "https://maxmarketpros.com",
    "telephone": "+1-949-603-0389",
    "email": "info@maxmarketpros.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "CA",
      "addressLocality": "Orange County"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.7175",
      "longitude": "-117.8311"
    },
    "openingHours": "Mo-Fr 09:00-17:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "33.7175",
        "longitude": "-117.8311"
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Google Business Profile Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Google Business Profile Verification",
            "description": "Professional verification service for Google Business Profile when postcards fail"
          },
          "price": "299",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "GMB Suspension Recovery",
            "description": "Help with Google Business Profile suspension and reinstatement"
          },
          "price": "399",
          "priceCurrency": "USD"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Max Market Pros helped us get our Google Business Profile verified in just 2 days when the postcard failed to arrive. Excellent service!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mike Rodriguez"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Professional and efficient service. They recovered our suspended GMB listing quickly and professionally."
      }
    ],
    "sameAs": [
      "https://www.facebook.com/maxmarketpros",
      "https://www.linkedin.com/company/maxmarketpros",
      "https://twitter.com/maxmarketpros"
    ],
    "image": [
      "https://maxmarketpros.com/google-business-verification.png",
      "https://maxmarketpros.com/max-market-pros-logo.png"
    ],
    "logo": "https://maxmarketpros.com/max-market-pros-logo.png",
    "founder": {
      "@type": "Person",
      "name": "Max Market Pros Team"
    },
    "foundingDate": "2020",
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      }
    ],
    "serviceType": [
      "Google Business Profile Verification",
      "GMB Suspension Recovery",
      "Local SEO Services",
      "Business Listing Management"
    ]
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
