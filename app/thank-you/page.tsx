"use client"

import { useEffect } from "react"
import { CheckCircle, Shield, Clock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function ThankYouPage() {
  useEffect(() => {
    // Trigger conversion event when the page loads
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17503097114/S1P6CPCSx40bEJqikJpB'
      })
    }
  }, [])

  const handlePhoneClick = () => {
    // Track phone call conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17503097114/S1P6CPCSx40bEJqikJpB'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-10">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Verification Request Submitted Successfully!
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Thank you! We've received your verification details and will begin processing your request immediately. 
                  Our expert team will review your information and contact you within 1-2 business days.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Next 24-48 Hours</p>
                      <ul className="text-sm sm:text-base text-gray-700 space-y-1">
                        <li>• Document review & verification strategy</li>
                        <li>• Google Business Profile optimization</li>
                        <li>• Initial verification submission</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Ongoing Support</p>
                      <ul className="text-sm sm:text-base text-gray-700 space-y-1">
                        <li>• Real-time verification monitoring</li>
                        <li>• Regular progress updates</li>
                        <li>• Expert consultation available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-gray-200 max-w-2xl mx-auto">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Need immediate assistance?</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      asChild
                      onClick={handlePhoneClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xl sm:text-2xl font-bold px-6 py-3 rounded-xl"
                    >
                      <a href="tel:+18884014221">(888) 401-4221</a>
                    </Button>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">Monday - Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg text-base sm:text-lg"
                >
                  <a href="/">Return to Homepage</a>
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                <span>Secure & Confidential</span>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>GDPR Compliant</span>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>SSL Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
