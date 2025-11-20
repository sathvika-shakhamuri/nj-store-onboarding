import { useState, useEffect, useMemo } from 'react'
import { FormData } from '../types'

import monsterEnergy from '../images/monster.png'
import vitaCoco from '../images/coconut-water.png'
import coldBrewLittleSaints from '../images/cold-brew.png'

import beefJerky from '../images/beef-jerkey.png'
import pistachios from '../images/pistachio.png'
import kettleChips from '../images/kettle-chips.png'

import proteinBars from '../images/protien-bar.png'
import biltong from '../images/brooklyn-biltong.png'

import driedFruitMix from '../images/fruit-mix.png'
import sunflowerSeeds from '../images/sunflower-seeds.png'

// Alcohol
import redWine from '../images/red-wine.png'
import tequila from '../images/tequila.png'
import vodka from '../images/vodka.png'

// Tobacco / vape
import mintVape from '../images/mint-vape.png'
import fruitVape from '../images/fruit-vape.png'

// Fuel / automotive
import fuelAdditive from '../images/fuel-additive.png'
import washerFluid from '../images/washer-fluid.png'

// Other / general store
import phoneCharger from '../images/phone-charger.png'
import cleaningKit from '../images/cleaning-kit.png'

interface Step3Props {
  formData: FormData
  onBack: () => void
}

// Base product data - metrics will be calculated dynamically
const BASE_PRODUCTS = {
  beverages: [
    {
      name: 'Monster Energy Drink',
      brand: 'Monster',
      image: monsterEnergy,
      baseOrders: 147,
      baseGrowth: 340,
      baseAvgOrder: 156,
      description: 'Tropical flavors driving repeat purchases',
    },
    {
      name: 'Vita Coco Coconut Water',
      brand: 'Vita Coco',
      image: vitaCoco,
      baseOrders: 203,
      baseGrowth: 180,
      baseAvgOrder: 142,
      description: 'Health-conscious customers love this',
    },
    {
      name: 'Cold Brew Coffee',
      brand: 'Little Saints',
      image: coldBrewLittleSaints,
      baseOrders: 89,
      baseGrowth: 215,
      baseAvgOrder: 128,
      description: 'Premium beverage with strong margins',
    },
  ],
  snacks: [
    {
      name: "Jack Link's Beef Jerky",
      brand: "Jack Link's",
      image: beefJerky,
      baseOrders: 176,
      baseGrowth: 290,
      baseAvgOrder: 185,
      description: 'Protein snacks trending across all demographics',
    },
    {
      name: 'Wonderful Pistachios',
      brand: 'Wonderful',
      image: pistachios,
      baseOrders: 134,
      baseGrowth: 245,
      baseAvgOrder: 167,
      description: 'Better-for-you snacking on the rise',
    },
    {
      name: 'Kettle Chips',
      brand: "Hal's",
      image: kettleChips,
      baseOrders: 98,
      baseGrowth: 198,
      baseAvgOrder: 124,
      description: 'Premium chips outperforming mainstream',
    },
  ],
  prepared_foods: [
    {
      name: 'Protein Meal Bars',
      brand: 'SANS',
      image: proteinBars,
      baseOrders: 112,
      baseGrowth: 267,
      baseAvgOrder: 198,
      description: 'Grab-and-go convenience driving growth',
    },
    {
      name: 'Biltong Snacks',
      brand: 'Brooklyn Biltong',
      image: biltong,
      baseOrders: 87,
      baseGrowth: 234,
      baseAvgOrder: 156,
      description: 'High-protein, low-carb trend',
    },
  ],
  organic: [
    {
      name: 'Dried Fruit Mix',
      brand: 'Mavuno Harvest',
      image: driedFruitMix,
      baseOrders: 156,
      baseGrowth: 312,
      baseAvgOrder: 178,
      description: 'Organic certification drives premium pricing',
    },
    {
      name: 'Sunflower Seeds',
      brand: 'David',
      image: sunflowerSeeds,
      baseOrders: 124,
      baseGrowth: 256,
      baseAvgOrder: 145,
      description: 'Plant-based protein snacking trend',
    },
  ],
  alcohol: [
    {
      name: 'Josh Cellars Cabernet Sauvignon',
      brand: 'Josh Cellars',
      image: redWine,
      baseOrders: 94,
      baseGrowth: 210,
      baseAvgOrder: 220,
      description: 'Top-selling red wine for weeknight and weekend shoppers',
    },
    {
      name: 'Casamigos Blanco Tequila',
      brand: 'Casamigos',
      image: tequila,
      baseOrders: 76,
      baseGrowth: 240,
      baseAvgOrder: 310,
      description: 'Premium tequila driving high-margin cocktail sales',
    },
    {
      name: "Tito's Handmade Vodka",
      brand: "Tito's",
      image: vodka,
      baseOrders: 113,
      baseGrowth: 190,
      baseAvgOrder: 260,
      description: 'Go-to vodka for both mixed drinks and shots',
    },
  ],
  tobacco_vape: [
    {
      name: 'Mint Disposable Vape',
      brand: 'CloudLine',
      image: mintVape,
      baseOrders: 68,
      baseGrowth: 225,
      baseAvgOrder: 145,
      description: 'Menthol and mint profiles trending with adult customers',
    },
    {
      name: 'Fruit Ice Disposable Vape',
      brand: 'CloudLine',
      image: fruitVape,
      baseOrders: 59,
      baseGrowth: 210,
      baseAvgOrder: 152,
      description: 'Rotating fruit flavors keep repeat buyers engaged',
    },
  ],
  fuel: [
    {
      name: 'Fuel System Cleaner',
      brand: 'DriveMax',
      image: fuelAdditive,
      baseOrders: 44,
      baseGrowth: 185,
      baseAvgOrder: 180,
      description: 'Attach-to-pump offer that lifts basket size at the forecourt',
    },
    {
      name: 'All-Season Washer Fluid',
      brand: 'ClearView',
      image: washerFluid,
      baseOrders: 51,
      baseGrowth: 198,
      baseAvgOrder: 135,
      description: 'High-turnover add-on for drivers topping off tanks',
    },
  ],
  other: [
    {
      name: 'Phone Charging Kit',
      brand: 'QuickCharge',
      image: phoneCharger,
      baseOrders: 73,
      baseGrowth: 205,
      baseAvgOrder: 160,
      description: 'Impulse-buy cables and adapters near the counter',
    },
    {
      name: 'Grab & Go Cleaning Kit',
      brand: 'Sparkle',
      image: cleaningKit,
      baseOrders: 39,
      baseGrowth: 190,
      baseAvgOrder: 120,
      description: 'Wipes and sprays that pair well with fuel and snack trips',
    },
  ],
}

// Normalize labels from Step 2 into simple keys
const normalizeCategory = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

// Map Step 2 values → BASE_PRODUCTS keys
const PRODUCT_CATEGORY_MAP: Record<string, keyof typeof BASE_PRODUCTS> = {
  // Food & bev
  snacks: 'snacks',                     // "Snacks"
  beverages: 'beverages',               // "Beverages"
  prepared_foods: 'prepared_foods',     // "Prepared Foods"
  organic_products: 'organic',          // "Organic Products"

  // Alcohol
  alcohol_wine_spirits: 'alcohol',      // "Alcohol/Wine/Spirits"

  // Non-food categories
  tobacco_vape_products: 'tobacco_vape',// "Tobacco/Vape Products"
  fuel: 'fuel',                         // "Fuel"
  other: 'other',                       // "Other"

  // Safety aliases
  organic: 'organic',
  alcohol: 'alcohol',
}

// ZIP code multipliers - higher traffic areas get higher metrics
const ZIP_MULTIPLIERS: Record<string, number> = {
  '07302': 1.25,
  '07030': 1.20,
  '07024': 1.10,
  '08701': 0.95,
  '07004': 1.15,
  '07442': 0.90,
  '08854': 1.05,
  '08401': 0.85,
  '08016': 1.00,
}

// Store type multipliers
const STORE_TYPE_MULTIPLIERS: Record<
  string,
  { orders: number; growth: number; avgOrder: number }
> = {
  convenience: { orders: 1.2, growth: 1.1, avgOrder: 0.9 },
  gas: { orders: 1.3, growth: 1.15, avgOrder: 0.85 },
  grocery: { orders: 1.0, growth: 1.0, avgOrder: 1.1 },
  foodservice: { orders: 0.9, growth: 1.2, avgOrder: 1.15 },
  liquor: { orders: 0.8, growth: 0.9, avgOrder: 1.2 },
}

export default function Step3({ formData }: Step3Props) {
  const [insights, setInsights] = useState<any>(null)

  // stable random seed per user
  const randomSeed = useMemo(() => {
    const seed = formData.zip + formData.storeName + formData.storeType
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash) / 2147483647
  }, [formData.zip, formData.storeName, formData.storeType])

  const opportunityScore = useMemo(() => {
    const base = 7.5 + randomSeed * 2
    return parseFloat(base.toFixed(1))
  }, [randomSeed])

  useEffect(() => {
    fetch('/data/insights.json')
      .then((r) => r.json())
      .then((data) => setInsights(data[formData.zip]))
      .catch((err) => console.error('Error loading insights:', err))
  }, [formData.zip])

  const calculateMetrics = (product: any, index: number) => {
    const zipMult = ZIP_MULTIPLIERS[formData.zip] || 1.0
    const storeTypeMult =
      STORE_TYPE_MULTIPLIERS[formData.storeType] || {
        orders: 1.0,
        growth: 1.0,
        avgOrder: 1.0,
      }
    const productSeed = (randomSeed + index * 0.1) % 1
    const randomFactor = 0.95 + productSeed * 0.1

    return {
      ...product,
      ordersLastWeek: Math.round(
        product.baseOrders * zipMult * storeTypeMult.orders * randomFactor
      ),
      growth: Math.round(
        product.baseGrowth * zipMult * storeTypeMult.growth * randomFactor
      ),
      avgOrderValue: Math.round(
        product.baseAvgOrder * zipMult * storeTypeMult.avgOrder * randomFactor
      ),
    }
  }

  const TRENDING_PRODUCTS = useMemo(() => {
    const result: any = {}
    let index = 0

    for (const [category, products] of Object.entries(BASE_PRODUCTS)) {
      result[category] = products.map((product) => {
        const calculated = calculateMetrics(product, index)
        index++
        return calculated
      })
    }

    return result
  }, [formData.zip, formData.storeType, randomSeed])

  const getRelevantProducts = () => {
    const products: any[] = []
    const seenCategories = new Set<keyof typeof BASE_PRODUCTS>()

    const addCategory = (catKey: keyof typeof BASE_PRODUCTS) => {
      if (seenCategories.has(catKey)) return
      seenCategories.add(catKey)
      products.push(...TRENDING_PRODUCTS[catKey])
    }

    // Use categories selected in Step 2
    formData.products.forEach((label) => {
      const normalized = normalizeCategory(label)
      const baseCategory = PRODUCT_CATEGORY_MAP[normalized]

      if (baseCategory && TRENDING_PRODUCTS[baseCategory]) {
        addCategory(baseCategory)
      }
    })

    // Fallback if nothing matched
    if (products.length === 0) {
      addCategory('beverages')
      addCategory('snacks')
    }

    return products.slice(0, 4)
  }

  const relevantProducts = getRelevantProducts()

  const areaNames: Record<string, string> = {
    '07302': 'Jersey City',
    '07030': 'Hoboken',
    '07024': 'Fort Lee',
    '08701': 'Lakewood',
    '08033': 'Haddonfield',
  }
  const areaName = areaNames[formData.zip] || 'your area'

  const scoreFactors = [
    { label: 'ZIP demand', value: 92 },
    { label: 'Store type fit', value: 88 },
    { label: 'Product selection', value: 85 },
    { label: 'Local competition', value: 79 },
  ]

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-pulse">Loading your personalized insights...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {formData.ownerName}!
        </h2>
        <p className="text-gray-600">
          Here's what customers in {areaName} are buying right now
        </p>
      </div>

      {/* Sales Opportunity Score */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg shadow-lg p-8 border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Sales Opportunity Score
            </h3>
            <p className="text-sm text-gray-600">
              Based on your market position and local demand
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-emerald-700">
              {opportunityScore}
            </div>
            <div className="text-sm text-gray-600 font-semibold">/ 10</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {scoreFactors.map((factor, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-lg border border-emerald-50"
            >
              <div className="text-2xl font-bold text-emerald-700">
                {factor.value}
              </div>
              <div className="text-xs text-gray-600">{factor.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div
        className="bg-white rounded-lg shadow-lg p-8"
        style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.08)' }}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            🔥 Trending around {areaName}
          </h3>
          <p className="text-gray-600">
            {insights.store_count} stores ordering in your area
          </p>

          {/* Category header + chips */}
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Categories performing best right now
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(formData.products.length
                ? formData.products
                : ['Snacks', 'Beverages', 'Prepared Foods']
              ).map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relevantProducts.map((product, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-5 hover:border-green-600 hover:shadow-xl transition-all"
            >
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {product.brand}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {product.description}
                  </p>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Stores carrying this</span>
                      <span className="font-semibold text-gray-900">
                        {product.ordersLastWeek} in {areaName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">New this month</span>
                      <span className="font-semibold text-green-700">
                        {Math.round(product.ordersLastWeek * 0.2)} stores
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Typical first order cost
                      </span>
                      <span className="font-semibold">
                        $
                        {Math.round(product.avgOrderValue * 0.9)}–
                        {Math.round(product.avgOrderValue * 1.1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors">
                Add to catalog →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-gray-700">
            <strong>💡 Pro tip:</strong> Stores stocking these products see{' '}
            <strong className="text-green-700">25% higher foot traffic</strong>{' '}
            and{' '}
            <strong className="text-green-700">
              $340 more weekly revenue
            </strong>{' '}
            on average in your market.
          </p>
        </div>
      </div>

      {/* Store Similarity Panel */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Stores like you are seeing highest growth in:
        </h3>
        <p className="text-gray-600 mb-4">
          Based on {formData.storeType} stores in {areaName}
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-100">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold text-gray-900">Energy drinks</div>
            <div className="text-sm text-gray-600 mt-1">+45% growth</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-100">
            <div className="text-3xl mb-2">🍿</div>
            <div className="font-semibold text-gray-900">
              Better-for-you snacks
            </div>
            <div className="text-sm text-gray-600 mt-1">+38% growth</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-100">
            <div className="text-3xl mb-2">🥗</div>
            <div className="font-semibold text-gray-900">Prepared foods</div>
            <div className="text-sm text-gray-600 mt-1">+32% growth</div>
          </div>
        </div>
      </div>

      {/* Snapshot of Local Market */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Snapshot of Your Local Market
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-5 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="text-4xl font-bold text-emerald-700">
              {insights.store_count}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Stores in {areaName}
            </div>
          </div>
          <div className="text-center p-5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-4xl font-bold text-gray-900">
              {insights.avg_rating.toFixed(1)}⭐
            </div>
            <div className="text-sm text-gray-600 mt-2">Average rating</div>
          </div>
          <div className="text-center p-5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-4xl font-bold text-gray-900">$2.4K</div>
            <div className="text-sm text-gray-600 mt-2">Avg weekly orders</div>
          </div>
        </div>
      </div>

      {/* What You're Building */}
      {formData.excitement && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Your Vision for {formData.storeName}
          </h3>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <p className="text-gray-700 italic leading-relaxed">
              "{formData.excitement}"
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            💪 We're excited to support this vision. Your sales rep will reach
            out to discuss how RepRally can help you grow.
          </p>
        </div>
      )}

      {/* What Happens Next */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">What happens in the next 24 hours</h3>
        <p className="text-green-100 mb-6">
          We'll help you get started immediately
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div>
              <div className="font-semibold mb-1">
                Your rep will {formData.contactPreference.join(' or ').toLowerCase()} you
              </div>
              <div className="text-sm text-green-100">
                {formData.timePreference === 'morning' &&
                  'Tomorrow morning between 8-11am'}
                {formData.timePreference === 'afternoon' &&
                  'Tomorrow afternoon between 12-3pm'}
                {formData.timePreference === 'evening' &&
                  'Tomorrow evening between 4-7pm'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div>
              <div className="font-semibold mb-1">
                Browse 20,000+ SKUs, place your first order
              </div>
              <div className="text-sm text-green-100">
                Zero minimums • First 3 products stores like you buy:{' '}
                {relevantProducts.slice(0, 3).map((p) => p.brand).join(', ')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/10 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div>
              <div className="font-semibold mb-1">
                Products arrive fresh in 3-5 business days
              </div>
              <div className="text-sm text-green-100">
                Drop-shipped directly from manufacturers to {formData.storeName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          Want to explore more opportunities or start over?
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-md"
        >
          Start New Onboarding
        </button>
      </div>
    </div>
  )
}