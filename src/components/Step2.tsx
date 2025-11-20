import { useState } from 'react'
import { FormData } from '../types'

interface Step2Props {
  formData: FormData
  onComplete: (data: Partial<FormData>) => void
  onBack: () => void
}

const PRODUCT_OPTIONS = [
  { 
    value: 'Snacks', 
    icon: '🍿',
    preview: 'Better-for-you snacks trending +40% in your area',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop'
  },
  { 
    value: 'Beverages', 
    icon: '🥤',
    preview: 'Energy drinks & functional beverages up +45% in Jersey City',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=200&h=200&fit=crop'
  },
  { 
    value: 'Prepared Foods', 
    icon: '🥗',
    preview: 'Grab-and-go meals driving 35% revenue growth',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
  },
  { 
    value: 'Organic Products', 
    icon: '🌿',
    preview: 'Organic demand 40% above state average in your ZIP',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop'
  },
  { 
    value: 'Alcohol/Wine/Spirits', 
    icon: '🍷',
    preview: 'Craft spirits outperforming national brands +40%',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop'
  },
  { 
    value: 'Tobacco/Vape Products', 
    icon: '💨',
    preview: 'Alternative nicotine products fastest-growing segment',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
  },
  { 
    value: 'Fuel', 
    icon: '⛽',
    preview: 'Loyalty programs increase repeat visits by 35%',
    image: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=200&h=200&fit=crop'
  },
  { 
    value: 'Other', 
    icon: '📦',
    preview: 'Specialty products create differentiation',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop'
  },
]

export default function Step2({ formData, onComplete, onBack }: Step2Props) {
  const [localData, setLocalData] = useState({
    products: formData.products || [],
    excitement: formData.excitement || '',
    contactPreference: formData.contactPreference || [],
    timePreference: formData.timePreference || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleProductToggle = (product: string) => {
    const updated = localData.products.includes(product)
      ? localData.products.filter((p) => p !== product)
      : [...localData.products, product]
    setLocalData({ ...localData, products: updated })
    
    if (errors.products) {
      setErrors({ ...errors, products: '' })
    }
  }

  const handleContactSelect = (method: string) => {
    // Single select - replace the array with just this method
    setLocalData({ ...localData, contactPreference: [method] })
    
    if (errors.contactPreference) {
      setErrors({ ...errors, contactPreference: '' })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (localData.products.length === 0) {
      newErrors.products = 'Please select at least one product category'
    }

    if (!localData.excitement.trim()) {
      newErrors.excitement = 'Please tell us what excites you'
    }

    if (localData.contactPreference.length === 0) {
      newErrors.contactPreference = 'Please select a contact method'
    }

    if (!localData.timePreference) {
      newErrors.timePreference = 'Please select your preferred time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onComplete(localData)
  }

  // Get selected product previews
  const selectedPreviews = PRODUCT_OPTIONS.filter(opt => 
    localData.products.includes(opt.value)
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What's performing well for you?
      </h2>
      <p className="text-gray-600 mb-6">
        Help us personalize your insights based on what matters most
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Products Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your top-performing categories *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCT_OPTIONS.map((product) => {
              const isSelected = localData.products.includes(product.value)
              return (
                <button
                  key={product.value}
                  type="button"
                  onClick={() => handleProductToggle(product.value)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected
                      ? 'border-green-600 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={product.image} 
                      alt={product.value}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isSelected ? 'from-green-900/80 to-green-900/40' : 'from-black/60 to-black/20'
                    }`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                      <span className="text-3xl mb-1">{product.icon}</span>
                      <span className="text-sm font-semibold text-center leading-tight">
                        {product.value}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {errors.products && (
            <p className="text-red-500 text-sm mt-2">{errors.products}</p>
          )}
        </div>

        {/* Real-time Preview */}
        {selectedPreviews.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200 animate-fade-in">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">✨</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">
                    Here's what we'll show you next...
                  </h3>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    {selectedPreviews.length} insight{selectedPreviews.length !== 1 ? 's' : ''} unlocked
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Based on your selections, you'll see trending products and insights for:
                </p>
              </div>
            </div>
            <div className="space-y-2 ml-11">
              {selectedPreviews.map((product, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-sm text-gray-700">{product.preview}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Excitement Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you most excited about right now? *
          </label>
          <textarea
            value={localData.excitement}
            onChange={(e) =>
              setLocalData({ ...localData, excitement: e.target.value })
            }
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.excitement ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell us about new products, store improvements, community initiatives, or anything else you're working on..."
          />
          {errors.excitement && (
            <p className="text-red-500 text-sm mt-1">{errors.excitement}</p>
          )}
        </div>

        {/* Contact Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Best way to reach you? *
            </label>
            <div className="space-y-2">
              {['Text Message', 'Email', 'Phone Call'].map((method) => {
                const isSelected = localData.contactPreference.includes(method)
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleContactSelect(method)}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all text-left flex items-center gap-3 ${
                      isSelected
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    {method}
                  </button>
                )
              })}
            </div>
            {errors.contactPreference && (
              <p className="text-red-500 text-sm mt-2">
                {errors.contactPreference}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Best time to connect? *
            </label>
            <div className="space-y-2">
              {[
                { value: 'morning', label: 'Morning (8-11am)', icon: '☀️' },
                { value: 'afternoon', label: 'Afternoon (12-3pm)', icon: '🌤️' },
                { value: 'evening', label: 'Evening (4-7pm)', icon: '🌆' },
              ].map((time) => {
                const isSelected = localData.timePreference === time.value
                return (
                  <button
                    key={time.value}
                    type="button"
                    onClick={() =>
                      setLocalData({ ...localData, timePreference: time.value })
                    }
                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all text-left flex items-center gap-3 ${
                      isSelected
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{time.icon}</span>
                    <span>{time.label}</span>
                  </button>
                )
              })}
            </div>
            {errors.timePreference && (
              <p className="text-red-500 text-sm mt-2">{errors.timePreference}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-md"
          >
            See My Insights →
          </button>
        </div>
      </form>
    </div>
  )
}