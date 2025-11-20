import { useState, useEffect } from 'react'
import { FormData, Store } from '../types'
import analytics from '../analytics'
import StoreMap from './StoreMap'

interface Step1Props {
  formData: FormData
  onComplete: (data: Partial<FormData>) => void
}

const STORE_TYPES = [
  { value: 'grocery', label: 'Grocery Store', icon: '🛒' },
  { value: 'convenience', label: 'Convenience Store', icon: '🏪' },
  { value: 'foodservice', label: 'Food Service / Restaurant', icon: '🍽️' },
  { value: 'gas', label: 'Gas Station', icon: '⛽' },
  { value: 'liquor', label: 'Liquor Store', icon: '🍷' },
  { value: 'tobacco_smoke', label: 'Tobacco / Smoke Shop', icon: '🚬' },
  { value: 'other', label: 'Other', icon: '📦' },
]

// Supported ZIPs with their centroids
const SUPPORTED_ZIPS: Record<string, { lat: number; lng: number; name: string }> = {
  '07004': { lat: 40.85, lng: -74.27, name: 'Fairfield' },
  '07024': { lat: 40.85, lng: -73.97, name: 'Fort Lee' },
  '07030': { lat: 40.74, lng: -74.03, name: 'Hoboken' },
  '07052': { lat: 40.79, lng: -74.24, name: 'West Orange' },
  '07302': { lat: 40.72, lng: -74.04, name: 'Jersey City' },
  '07442': { lat: 41.00, lng: -74.28, name: 'Pompton Lakes' },
  '07726': { lat: 40.26, lng: -74.06, name: 'Manalapan' },
  '07753': { lat: 40.20, lng: -74.05, name: 'Neptune' },
  '07901': { lat: 40.71, lng: -74.36, name: 'Summit' },
  '08016': { lat: 40.07, lng: -74.86, name: 'Burlington' },
  '08204': { lat: 39.03, lng: -74.90, name: 'Cape May' },
  '08401': { lat: 39.36, lng: -74.42, name: 'Atlantic City' },
  '08558': { lat: 40.41, lng: -74.66, name: 'Skillman' },
  '08701': { lat: 40.09, lng: -74.21, name: 'Lakewood' },
  '08757': { lat: 39.95, lng: -74.19, name: 'Toms River' },
  '08822': { lat: 40.51, lng: -74.86, name: 'Flemington' },
  '08854': { lat: 40.51, lng: -74.45, name: 'Piscataway' },
}

// Validate NJ ZIP and find nearest supported ZIP
function findNearestSupportedZip(inputZip: string): string | null {
  // Basic NJ ZIP validation (starts with 07 or 08)
  if (!/^0[78]\d{3}$/.test(inputZip)) {
    return null
  }
  
  // If exact match, return it
  if (SUPPORTED_ZIPS[inputZip]) {
    return inputZip
  }
  
  // Otherwise, find nearest by ZIP number proximity (simple heuristic)
  const inputNum = parseInt(inputZip)
  let nearest = Object.keys(SUPPORTED_ZIPS)[0]
  let minDiff = Math.abs(inputNum - parseInt(nearest))
  
  for (const zip of Object.keys(SUPPORTED_ZIPS)) {
    const diff = Math.abs(inputNum - parseInt(zip))
    if (diff < minDiff) {
      minDiff = diff
      nearest = zip
    }
  }
  
  return nearest
}

// Micro-wow insights with deeper intelligence
const ZIP_INSIGHTS: Record<string, { growth: string; vibe: string; topCategories: string; commonType: string }> = {
  '07302': {
    growth: "one of NJ's fastest-growing ZIPs — store openings up +12% this year",
    vibe: "Customers here love cold drinks + quick meals",
    topCategories: "Beverages • Prepared Foods • Snacks",
    commonType: "Convenience stores (+18% YoY)"
  },
  '07030': {
    growth: "a premium retail hub with high foot traffic",
    vibe: "Organic and specialty products perform extremely well",
    topCategories: "Organic Products • Beverages • Specialty Items",
    commonType: "Grocery stores (+14% YoY)"
  },
  '07024': {
    growth: "experiencing steady growth with affluent demographics",
    vibe: "Health-conscious options and premium brands resonate",
    topCategories: "Organic Products • Premium Beverages • Prepared Foods",
    commonType: "Specialty retail (+16% YoY)"
  },
  '08701': {
    growth: "a diverse market with strong family demographics",
    vibe: "Value packs and family-size products trending",
    topCategories: "Snacks • Beverages • Family Packs",
    commonType: "Grocery stores (+11% YoY)"
  },
  '08033': {
    growth: "an established market with loyal customer base",
    vibe: "Local and artisan products drive differentiation",
    topCategories: "Local Products • Craft Beverages • Specialty Foods",
    commonType: "Specialty stores (+9% YoY)"
  },
}

const DEFAULT_ZIP_INSIGHT = {
  growth: "showing consistent demand growth",
  vibe: "Trending products and quality service drive success",
  topCategories: "Beverages • Snacks • Prepared Foods",
  commonType: "Convenience stores"
}

export default function Step1({ formData, onComplete }: Step1Props) {
  const [localData, setLocalData] = useState({
    storeName: formData.storeName,
    zip: formData.zip || '',
    storeType: formData.storeType,
    ownerName: formData.ownerName,
    contactMethod: formData.contactMethod,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [stores, setStores] = useState<Store[]>([])
  const [nearbyStores, setNearbyStores] = useState<Store[]>([])
  const [showMap, setShowMap] = useState(false)
  const [showZipInsight, setShowZipInsight] = useState(false)
  const [mappedZip, setMappedZip] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/stores.json')
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error('Error loading stores:', err))
  }, [])

  useEffect(() => {
    if (localData.zip && stores.length > 0) {
      const nearestZip = findNearestSupportedZip(localData.zip)
      
      if (nearestZip) {
        setMappedZip(nearestZip)
        const nearby = stores.filter((s) => s.zip === nearestZip)
        setNearbyStores(nearby)
        
        if (nearby.length > 0) {
          setShowMap(true)
          setShowZipInsight(true)
        }
      } else {
        setShowMap(false)
        setShowZipInsight(false)
        setMappedZip(null)
      }
    } else {
      setShowZipInsight(false)
      setMappedZip(null)
    }
  }, [localData.zip, stores])

  const handleChange = (field: string, value: string) => {
    setLocalData({ ...localData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }

    if (field === 'storeType' && value) {
      analytics.storeTypeSelected(value)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!localData.storeName.trim()) {
      newErrors.storeName = 'Store name is required'
    }

    if (!localData.zip.trim()) {
      newErrors.zip = 'ZIP code is required'
    } else {
      const nearestZip = findNearestSupportedZip(localData.zip)
      if (!nearestZip) {
        newErrors.zip = 'Please enter a valid New Jersey ZIP code (starts with 07 or 08)'
      }
    }

    if (!localData.storeType) {
      newErrors.storeType = 'Please select a store type'
    }

    if (!localData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required'
    }

    if (!localData.contactMethod.trim()) {
      newErrors.contactMethod = 'Contact information is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const effectiveZip = mappedZip || localData.zip
    const zipInfo = SUPPORTED_ZIPS[effectiveZip]

    onComplete({
      ...localData,
      zip: effectiveZip,
      lat: zipInfo?.lat,
      lng: zipInfo?.lng,
    })
  }

  const effectiveZip = mappedZip || localData.zip
  const zipInfo = SUPPORTED_ZIPS[effectiveZip]
  const zipInsight = ZIP_INSIGHTS[effectiveZip] || DEFAULT_ZIP_INSIGHT
  const areaName = zipInfo?.name || 'your area'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 inline-block">
          Your Store, Your Needs, and Insights
        </h2>
        <div className="border-t-2 border-gray-300 mx-auto w-16 mt-1"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                value={localData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                onFocus={() => analytics.fieldFocused('storeName')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.storeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Main Street Market"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={localData.zip}
                onChange={(e) => handleChange('zip', e.target.value)}
                onFocus={() => analytics.fieldFocused('zip')}
                maxLength={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.zip ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 07302"
              />
              {errors.zip && (
                <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Any New Jersey ZIP code accepted
              </p>
            </div>

            {/* Micro-wow ZIP insight */}
            {showZipInsight && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 animate-fade-in">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {areaName} is {zipInsight.growth}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Word on the street: {zipInsight.vibe}
                    </p>
                  </div>
                </div>
                <div className="ml-9 space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📊 Top categories:</span>
                    <span>{zipInsight.topCategories}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🏪 Most common:</span>
                    <span>{zipInsight.commonType}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Type *
              </label>
              <select
                value={localData.storeType}
                onChange={(e) => handleChange('storeType', e.target.value)}
                onFocus={() => analytics.fieldFocused('storeType')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.storeType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a type...</option>
                {STORE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.storeType && (
                <p className="text-red-500 text-sm mt-1">{errors.storeType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                value={localData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                onFocus={() => analytics.fieldFocused('ownerName')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.ownerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your name"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone *
              </label>
              <input
                type="text"
                value={localData.contactMethod}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                onFocus={() => analytics.fieldFocused('contactMethod')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.contactMethod ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="email@example.com or (555) 123-4567"
              />
              {errors.contactMethod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactMethod}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Map */}
          <div>
            {showMap && nearbyStores.length > 0 && zipInfo ? (
              <div className="sticky top-8">
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Neighborhood
                  </h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-green-700">
                      {nearbyStores.length}
                    </span>{' '}
                    stores in {areaName}
                  </p>
                  {localData.storeType && (
                    <p className="text-sm text-gray-600 mt-1">
                      {
                        nearbyStores.filter((s) => s.type === localData.storeType)
                          .length
                      }{' '}
                      {STORE_TYPES.find((t) => t.value === localData.storeType)?.label}s nearby
                    </p>
                  )}
                </div>
                <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
                  <StoreMap
                    userLat={zipInfo.lat}
                    userLng={zipInfo.lng}
                    nearbyStores={nearbyStores.slice(0, 100)}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center p-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">
                    Enter your ZIP code to see what's happening around you
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-md"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  )
}