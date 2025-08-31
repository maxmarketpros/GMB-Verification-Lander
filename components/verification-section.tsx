"use client"

import { VerificationWizard } from "@/components/verification-wizard"
import { CheckCircle, Shield, Clock, Star, Users, Award } from "lucide-react"

export function VerificationSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:py-20" id="get-verified">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            Official Google Business Profile Verification
          </div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Get Verified Today
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Complete our secure verification process to get your business visible on Google Search and Maps. 
            <span className="font-semibold text-gray-800"> Trusted by 10,000+ businesses nationwide.</span>
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-sm sm:text-base">4.9/5 Rating</span>
            </div>
            
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="font-semibold text-sm sm:text-base">10,000+ Verified</span>
            </div>
            
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-semibold text-sm sm:text-base">98% Success Rate</span>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Fast Verification</h3>
              <p className="text-sm sm:text-base text-gray-600">Complete in 5-10 minutes. Most businesses verified within 3-7 days.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-sm sm:text-base text-gray-600">Bank-level encryption protects your business information.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm sm:text-base text-gray-600">Dedicated verification specialists guide you through every step.</p>
            </div>
          </div>
        </div>

        {/* Verification Wizard */}
        <VerificationWizard />
        
        {/* Bottom Trust Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            We only support legitimate businesses that meet Google's eligibility requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-gray-400">
            <span>SSL Secured</span>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>GDPR Compliant</span>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>
    </section>
  )
}
