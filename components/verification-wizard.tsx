"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Phone, 
  Building2, 
  MapPin, 
  FileText, 
  Camera,
  Shield,
  Clock,
  AlertCircle
} from "lucide-react"

// Validation schemas
const phase1Schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  phoneNumber: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  consent: z.boolean().refine(val => val === true, "You must agree to be contacted"),
  // Honeypot field
  website: z.string().max(0, "This field should be empty")
})

// File validation helper for client-side only
const validateFiles = (files: any[]) => {
  if (typeof window === 'undefined') return true // Skip validation during SSR
  return files.every(file => file instanceof File)
}

const phase2Step2Schema = z.object({
  legalBusinessName: z.string().min(1, "Legal business name is required"),
  showAddress: z.enum(["yes", "no"]),
  businessType: z.enum(["storefront", "sab", "shared", "home"]),
  streetAddress: z.string().optional(),
  unit: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  serviceArea: z.string().optional(),
  attemptedVideoVerification: z.enum(["yes", "no"]),
  phoneUsedElsewhere: z.enum(["yes", "no"]),
  submittedReinstatement: z.enum(["yes", "no"]),
  reinstatementDetails: z.string().optional()
})

const phase2Step3Schema = z.object({
  businessDocuments: z.array(z.any()).min(1, "Business documents are required").refine(validateFiles, "Please select valid files"),
  signagePhotos: z.array(z.any()).optional().refine(files => !files || validateFiles(files), "Please select valid files"),
  notes: z.string().optional(),
  accuracyConfirmation: z.boolean().refine(val => val === true, "You must confirm accuracy"),
  eligibilityConfirmation: z.boolean().refine(val => val === true, "You must confirm eligibility understanding")
})

type Phase1Data = z.infer<typeof phase1Schema>
type Phase2Step2Data = z.infer<typeof phase2Step2Schema>
type Phase2Step3Data = z.infer<typeof phase2Step3Schema>

interface VerificationWizardProps {
  onClose?: () => void
}

export function VerificationWizard({ onClose }: VerificationWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadId] = useState(() => `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [phase1Submitted, setPhase1Submitted] = useState(false)
  const [phase2Submitted, setPhase2Submitted] = useState(false)

  // Phase 1 form
  const phase1Form = useForm<Phase1Data>({
    resolver: zodResolver(phase1Schema),
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      email: "",
      consent: false,
      website: "" // honeypot
    }
  })

  // Phase 2 Step 2 form
  const phase2Step2Form = useForm<Phase2Step2Data>({
    resolver: zodResolver(phase2Step2Schema),
    defaultValues: {
      legalBusinessName: "",
      showAddress: "yes",
      businessType: "storefront",
      attemptedVideoVerification: "no",
      phoneUsedElsewhere: "no",
      submittedReinstatement: "no"
    }
  })

  // Phase 2 Step 3 form
  const phase2Step3Form = useForm<Phase2Step3Data>({
    resolver: zodResolver(phase2Step3Schema),
    defaultValues: {
      businessDocuments: [],
      signagePhotos: [],
      notes: "",
      accuracyConfirmation: false,
      eligibilityConfirmation: false
    }
  })

  const businessType = phase2Step2Form.watch("businessType")
  const showAddress = phase2Step2Form.watch("showAddress")
  const submittedReinstatement = phase2Step2Form.watch("submittedReinstatement")

  // Submit Phase 1 (Lead Capture)
  const submitPhase1 = async (data: Phase1Data) => {
    setIsSubmitting(true)
    
    try {
      // Create form data for Netlify
      const formData = new FormData()
      formData.append("form-name", "verification-lead-capture")
      formData.append("lead-id", leadId)
      formData.append("business-name", data.businessName)
      formData.append("phone-number", data.phoneNumber)
      formData.append("email", data.email)
      formData.append("consent", data.consent.toString())

      // Submit to Netlify
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString()
      })

      setPhase1Submitted(true)
      setIsTransitioning(true)

      // Show transition screen for 2 seconds
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentStep(2)
      }, 2000)

    } catch (error) {
      console.error("Error submitting Phase 1:", error)
      // Handle error - show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Phase 2 (Complete Details)
  const submitPhase2 = async () => {
    const step2Data = phase2Step2Form.getValues()
    const step3Data = phase2Step3Form.getValues()
    const phase1Data = phase1Form.getValues()
    
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("form-name", "verification-details")
      formData.append("lead-id", leadId)
      
      // Legal business name (from step 2) - at the top
      formData.append("legal-business-name", step2Data.legalBusinessName)
      
      // Step 2 data
      formData.append("show-address", step2Data.showAddress)
      formData.append("business-type", step2Data.businessType)
      if (step2Data.streetAddress) formData.append("street-address", step2Data.streetAddress)
      if (step2Data.unit) formData.append("unit", step2Data.unit)
      if (step2Data.city) formData.append("city", step2Data.city)
      if (step2Data.state) formData.append("state", step2Data.state)
      if (step2Data.zipCode) formData.append("zip-code", step2Data.zipCode)
      if (step2Data.serviceArea) formData.append("service-area", step2Data.serviceArea)
      formData.append("attempted-video-verification", step2Data.attemptedVideoVerification)
      formData.append("phone-used-elsewhere", step2Data.phoneUsedElsewhere)
      formData.append("submitted-reinstatement", step2Data.submittedReinstatement)
      if (step2Data.reinstatementDetails) formData.append("reinstatement-details", step2Data.reinstatementDetails)

      // Step 3 data
      step3Data.businessDocuments.forEach((file, index) => {
        formData.append(`business-document-${index}`, file)
      })
      step3Data.signagePhotos?.forEach((file, index) => {
        formData.append(`signage-photo-${index}`, file)
      })
      if (step3Data.notes) formData.append("notes", step3Data.notes)
      formData.append("accuracy-confirmation", step3Data.accuracyConfirmation.toString())
      formData.append("eligibility-confirmation", step3Data.eligibilityConfirmation.toString())

      // Submit to Netlify
      await fetch("/", {
        method: "POST",
        body: formData
      })

      setPhase2Submitted(true)
      setCurrentStep(4) // Success state

    } catch (error) {
      console.error("Error submitting Phase 2:", error)
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's get you verified"
      case 2: return "Your business location"
      case 3: return "Proof for verification"
      case 4: return "Thanks—your verification details were received"
      default: return ""
    }
  }

  const getProgressText = () => {
    if (currentStep <= 1) return "Step 1 of 3"
    if (currentStep === 2) return "Step 2 of 3"
    if (currentStep === 3) return "Step 3 of 3"
    return "Complete"
  }

  // Transition/Loading Screen
  if (isTransitioning) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-10">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Preparing Your Verification
              </h3>
              <p className="text-base sm:text-lg text-gray-600">Here's what we'll need to get you verified with Google</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Business Address</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Business Documents</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Signage Photos</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Verification History</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse transition-all duration-2000 w-3/4"></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Setting up your verification process...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6" id="verification-form">
      {/* Help Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-base sm:text-lg">Need assistance?</p>
              <p className="text-blue-100 text-sm sm:text-base">Our experts are standing by to help</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xl sm:text-2xl font-bold">(888) 401-4221</p>
            <p className="text-blue-100 text-xs sm:text-sm">Available 9 AM - 6 PM EST</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Enhanced Progress Header */}
        {currentStep < 4 && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">{currentStep}</span>
                </div>
                <span className="text-base sm:text-lg font-semibold text-gray-900">{getProgressText()}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {currentStep === 1 && "Contact Information"}
                {currentStep === 2 && "Business Details"}
                {currentStep === 3 && "Verification Documents"}
              </div>
            </div>
            
            {/* Modern Progress Bar */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 ${
                        step < currentStep 
                          ? 'bg-green-500 text-white' 
                          : step === currentStep 
                          ? 'bg-blue-600 text-white ring-2 sm:ring-4 ring-blue-200' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div 
                        className={`h-1 w-8 sm:w-20 mx-1 sm:mx-2 rounded-full transition-all duration-500 ${
                          step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Progress Percentage */}
              <div className="mt-2 sm:mt-3">
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {Math.round((currentStep / 3) * 100)}% Complete
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-10">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4">
              {getStepTitle()}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {currentStep === 1 && "Let's start with your basic business information"}
              {currentStep === 2 && "Tell us about your business location and verification history"}
              {currentStep === 3 && "Upload documents to complete your verification request"}
            </p>
          </div>

          {/* Step 1: Lead Capture */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={phase1Form.handleSubmit(submitPhase1)} className="space-y-6 sm:space-y-8">
                {/* Honeypot field */}
                <div className="hidden">
                  <Input
                    {...phase1Form.register("website")}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <Label htmlFor="businessName" className="text-base sm:text-lg font-semibold text-gray-900">
                        Business name *
                      </Label>
                    </div>
                    <Input
                      id="businessName"
                      {...phase1Form.register("businessName")}
                      placeholder="Enter your business name"
                      className="h-12 sm:h-14 text-base sm:text-lg"
                    />
                    {phase1Form.formState.errors.businessName && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {phase1Form.formState.errors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      <Label htmlFor="phoneNumber" className="text-base sm:text-lg font-semibold text-gray-900">
                        Phone number (public on Google) *
                      </Label>
                    </div>
                    <Input
                      id="phoneNumber"
                      {...phase1Form.register("phoneNumber")}
                      placeholder="(555) 123-4567"
                      type="tel"
                      className="h-12 sm:h-14 text-base sm:text-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">This will be displayed on your Google Business Profile</p>
                    {phase1Form.formState.errors.phoneNumber && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {phase1Form.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <Label htmlFor="email" className="text-base sm:text-lg font-semibold text-gray-900">
                        Email (Google account or best contact) *
                      </Label>
                    </div>
                    <Input
                      id="email"
                      {...phase1Form.register("email")}
                      placeholder="you@yourbusiness.com"
                      type="email"
                      className="h-12 sm:h-14 text-base sm:text-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">We'll use this to contact you about your verification</p>
                    {phase1Form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {phase1Form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Controller
                        name="consent"
                        control={phase1Form.control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 w-4 h-4 sm:w-5 sm:h-5"
                          />
                        )}
                      />
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-medium text-gray-900">
                          I agree to be contacted about verification and next steps. *
                        </Label>
                        <p className="text-sm text-gray-600">
                          Our verification specialists may contact you via phone or email to guide you through the process.
                        </p>
                        {phase1Form.formState.errors.consent && (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {phase1Form.formState.errors.consent.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 sm:h-16 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Continue to Business Details
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Business Location & Type */}
          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  // Validate the form first
                  const isValid = await phase2Step2Form.trigger()
                  if (isValid) {
                    setCurrentStep(3)
                  }
                }} 
                className="space-y-6 sm:space-y-8"
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <Label htmlFor="legalBusinessName" className="text-base sm:text-lg font-semibold text-gray-900">
                        Legal Business Name *
                      </Label>
                    </div>
                    <Input
                      id="legalBusinessName"
                      {...phase2Step2Form.register("legalBusinessName")}
                      placeholder="Enter your legal business name"
                      className="h-12 sm:h-14 text-base sm:text-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">This should match your business registration or license</p>
                    {phase2Step2Form.formState.errors.legalBusinessName && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {phase2Step2Form.formState.errors.legalBusinessName.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <Label className="text-base sm:text-lg font-semibold text-gray-900">Business Visibility</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm sm:text-base font-medium text-gray-900 mb-3 block">Show address on Google? *</Label>
                        <Controller
                          name="showAddress"
                          control={phase2Step2Form.control}
                          render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="yes" id="show-yes" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="show-yes" className="text-sm sm:text-base font-medium cursor-pointer">Yes, show my address</Label>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="no" id="show-no" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="show-no" className="text-sm sm:text-base font-medium cursor-pointer">No, hide my address</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </div>

                      <div>
                        <Label className="text-sm sm:text-base font-medium text-gray-900 mb-3 block">Business type *</Label>
                        <Controller
                          name="businessType"
                          control={phase2Step2Form.control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Select your business type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="storefront">Storefront - Physical location customers visit</SelectItem>
                                <SelectItem value="sab">Service-Area Business - Go to customers</SelectItem>
                                <SelectItem value="shared">Shared / Co-working Space</SelectItem>
                                <SelectItem value="home">Home Office</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {(["storefront", "shared", "home"].includes(businessType) || showAddress === "yes") && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-200">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Physical Address</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="streetAddress" className="text-sm sm:text-base font-medium">Street Address</Label>
                          <Input
                            id="streetAddress"
                            {...phase2Step2Form.register("streetAddress")}
                            placeholder="123 Main Street"
                            className="h-12 text-base mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="unit" className="text-sm sm:text-base font-medium">Unit/Suite (optional)</Label>
                          <Input
                            id="unit"
                            {...phase2Step2Form.register("unit")}
                            placeholder="Suite 100"
                            className="h-12 text-base mt-2"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-sm sm:text-base font-medium">City</Label>
                            <Input
                              id="city"
                              {...phase2Step2Form.register("city")}
                              placeholder="Your City"
                              className="h-12 text-base mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="state" className="text-sm sm:text-base font-medium">State</Label>
                            <Input
                              id="state"
                              {...phase2Step2Form.register("state")}
                              placeholder="State"
                              className="h-12 text-base mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="zipCode" className="text-sm sm:text-base font-medium">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              {...phase2Step2Form.register("zipCode")}
                              placeholder="12345"
                              className="h-12 text-base mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {businessType === "sab" && (
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 sm:p-6 border border-purple-200">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        <Label htmlFor="serviceArea" className="text-base sm:text-lg font-semibold text-gray-900">Service Area</Label>
                      </div>
                      <Textarea
                        id="serviceArea"
                        {...phase2Step2Form.register("serviceArea")}
                        placeholder="Describe the areas you serve (e.g., Los Angeles County, within 25 miles of downtown)"
                        rows={3}
                        className="text-base"
                      />
                      <p className="text-sm text-gray-600 mt-2">Be specific about the geographic areas where you provide services</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">Verification History</h4>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <Label className="text-sm sm:text-base font-medium text-gray-900 mb-3 block">Attempted video verification before? *</Label>
                        <Controller
                          name="attemptedVideoVerification"
                          control={phase2Step2Form.control}
                          render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="yes" id="video-yes" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="video-yes" className="text-sm sm:text-base font-medium cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="no" id="video-no" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="video-no" className="text-sm sm:text-base font-medium cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </div>

                      <div>
                        <Label className="text-sm sm:text-base font-medium text-gray-900 mb-3 block">Is this phone number used on any other profiles (past/present)? *</Label>
                        <Controller
                          name="phoneUsedElsewhere"
                          control={phase2Step2Form.control}
                          render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="yes" id="phone-yes" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="phone-yes" className="text-sm sm:text-base font-medium cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="no" id="phone-no" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="phone-no" className="text-sm sm:text-base font-medium cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </div>

                      <div>
                        <Label className="text-sm sm:text-base font-medium text-gray-900 mb-3 block">Previously submitted a reinstatement request? *</Label>
                        <Controller
                          name="submittedReinstatement"
                          control={phase2Step2Form.control}
                          render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="yes" id="reinstatement-yes" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="reinstatement-yes" className="text-sm sm:text-base font-medium cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value="no" id="reinstatement-no" className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Label htmlFor="reinstatement-no" className="text-sm sm:text-base font-medium cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </div>

                      {submittedReinstatement === "yes" && (
                        <div className="bg-white rounded-xl p-4 border border-orange-200">
                          <Label htmlFor="reinstatementDetails" className="text-sm sm:text-base font-medium text-gray-900">
                            Date and case number (if available)
                          </Label>
                          <Textarea
                            id="reinstatementDetails"
                            {...phase2Step2Form.register("reinstatementDetails")}
                            placeholder="Please provide the date and any case number from your reinstatement request"
                            rows={2}
                            className="mt-2 text-base"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 h-12 text-base font-medium"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Contact Info
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-semibold"
                  >
                    Continue to Documents
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Evidence & Uploads */}
          {currentStep === 3 && (
            <form onSubmit={phase2Step3Form.handleSubmit(submitPhase2)} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Controller
                    name="businessDocuments"
                    control={phase2Step3Form.control}
                    render={({ field }) => (
                      <FileUpload
                        label="Business documents"
                        helperText="Upload LLC/DBA, business license, or a recent utility bill that matches your listing name."
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        multiple={true}
                        value={field.value}
                        onChange={field.onChange}
                        required
                      />
                    )}
                  />
                  {phase2Step3Form.formState.errors.businessDocuments && (
                    <p className="text-sm text-red-600">{phase2Step3Form.formState.errors.businessDocuments.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Controller
                    name="signagePhotos"
                    control={phase2Step3Form.control}
                    render={({ field }) => (
                      <FileUpload
                        label={`Signage / vehicle photos ${businessType === "sab" ? "(optional but encouraged)" : "(required for storefront/shared)"}`}
                        helperText={
                          businessType === "sab" 
                            ? "Upload photos of branded vehicle, tools, or storage area if available."
                            : "Upload clear photos of your business signage."
                        }
                        accept="image/*"
                        multiple={true}
                        value={field.value || []}
                        onChange={field.onChange}
                        required={["storefront", "shared"].includes(businessType)}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    {...phase2Step3Form.register("notes")}
                    placeholder="Anything else that helps us verify you?"
                    rows={3}
                  />
                </div>

                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Compliance Confirmations
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Controller
                        name="accuracyConfirmation"
                        control={phase2Step3Form.control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        )}
                      />
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-700">
                          All information provided is accurate. *
                        </Label>
                        {phase2Step3Form.formState.errors.accuracyConfirmation && (
                          <p className="text-sm text-red-600">{phase2Step3Form.formState.errors.accuracyConfirmation.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Controller
                        name="eligibilityConfirmation"
                        control={phase2Step3Form.control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        )}
                      />
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-700">
                          I understand virtual offices/PO Boxes are not eligible. *
                        </Label>
                        {phase2Step3Form.formState.errors.eligibilityConfirmation && (
                          <p className="text-sm text-red-600">{phase2Step3Form.formState.errors.eligibilityConfirmation.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
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
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Verification Request Submitted Successfully!
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Thank you! We've received your verification details and will begin processing your request immediately. 
                    Our expert team will review your information and contact you within 1-2 business days.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 mb-2">Next 24-48 Hours</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Document review & verification strategy</li>
                          <li>• Google Business Profile optimization</li>
                          <li>• Initial verification submission</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 mb-2">Ongoing Support</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Real-time verification monitoring</li>
                          <li>• Regular progress updates</li>
                          <li>• Expert consultation available</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">Need immediate assistance?</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">(888) 401-4221</p>
                      <p className="text-xs sm:text-sm text-gray-600">Monday - Friday, 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {onClose && (
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg"
                  >
                    Continue Browsing
                  </Button>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-400">
                  <span>Secure & Confidential</span>
                  <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>GDPR Compliant</span>
                  <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>SSL Protected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
