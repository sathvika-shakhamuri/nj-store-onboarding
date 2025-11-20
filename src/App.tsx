import { useState, useEffect } from 'react'
import { FormData } from './types'
import analytics from './analytics'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [startTime] = useState(Date.now())
  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    address: '',
    storeType: '',
    ownerName: '',
    contactMethod: '',
    lat: undefined,
    lng: undefined,
    zip: '',
    products: [],
    excitement: '',
    contactPreference: [],
    timePreference: '',
  })

  // Onboarding start + abandonment tracking
  useEffect(() => {
    analytics.onboardingStarted()
    analytics.trackPageView('onboarding_start')

    const handleBeforeUnload = () => {
      if (currentStep < 3) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        analytics.onboardingAbandoned({
          last_step: `step${currentStep}`,
          time_spent_seconds: timeSpent,
          store_type: formData.storeType,
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // NEW: Track when each step is *viewed*
  useEffect(() => {
    analytics.stepViewed(currentStep, {
      store_type: formData.storeType,
      zip: formData.zip,
      products_selected_count: formData.products.length,
    })
  }, [currentStep, formData.storeType, formData.zip, formData.products.length])

  const handleStep1Complete = (data: Partial<FormData>) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    setFormData({ ...formData, ...data })

    analytics.step1Completed({
      store_type: data.storeType || '',
      nearby_stores_count: 0,
      time_spent_seconds: timeSpent,
    })

    setCurrentStep(2)
  }

  const handleStep2Complete = (data: Partial<FormData>) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    setFormData({ ...formData, ...data })

    analytics.step2Completed({
      products_selected_count: data.products?.length || 0,
      contact_preferences: data.contactPreference || [],
      time_preference: data.timePreference || '',
      time_spent_seconds: timeSpent,
    })

    setCurrentStep(3)

    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    analytics.onboardingCompleted({
      total_time_seconds: totalTime,
      store_type: formData.storeType,
    })
  }

  const handleBack = (step: number) => {
    setCurrentStep(step)
  }

  // width of the *active* part of the line
  const activeLineWidth =
    currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with branding */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/reprally-logo.png"
              alt="RepRally"
              className="h-12 w-auto"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Get Access to 250+ Trending Brands
            </h1>
            <p className="text-lg text-gray-600">
              Zero minimums • 3-5 day delivery • Local sales rep support
            </p>
          </div>
        </div>

        {/* ---------------------- */}
        {/*       PROGRESS BAR     */}
        {/* ---------------------- */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative flex items-center justify-between">

            {/* Base line (light gray, full width under circles) */}
            <div className="absolute left-0 right-0 top-5 h-[2px] bg-gray-300" />

            {/* Active line (green, from step 1 to current step) */}
            <div
              className="absolute left-0 top-5 h-[2px] bg-green-700 transition-all duration-500"
              style={{ width: activeLineWidth }}
            />

            {/* Step circles + labels (sit on top of the line) */}
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm text-gray-600 mt-2">
                  {step === 1
                    ? 'Your Store'
                    : step === 2
                    ? 'Your Needs'
                    : 'Insights'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------- */}
        {/*       STEP CONTENT     */}
        {/* ---------------------- */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && (
            <Step1 formData={formData} onComplete={handleStep1Complete} />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              onComplete={handleStep2Complete}
              onBack={() => handleBack(1)}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              onBack={() => handleBack(2)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
