import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Store } from '../types'
import analytics from '../analytics'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface StoreMapProps {
  userLat: number
  userLng: number
  nearbyStores: Store[]
}

// Color mapping for store types
const STORE_TYPE_COLORS: Record<string, { color: string; label: string }> = {
  grocery: { color: '#10b981', label: 'Grocery' },
  convenience: { color: '#f59e0b', label: 'Convenience' },
  foodservice: { color: '#ef4444', label: 'Food Service' },
  liquor: { color: '#8b5cf6', label: 'Liquor' },
  gas: { color: '#3b82f6', label: 'Gas' },
  tobacco_smoke: { color: '#6b7280', label: 'Tobacco' },
  other: { color: '#64748b', label: 'Other' },
}

// Custom pulsing circle CSS
const pulseCSS = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
  .pulse-marker {
    animation: pulse 2s infinite;
  }
`

export default function StoreMap({
  userLat,
  userLng,
  nearbyStores,
}: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Add pulse animation CSS
    const style = document.createElement('style')
    style.textContent = pulseCSS
    document.head.appendChild(style)

    // Create map instance
    const map = L.map(mapRef.current).setView([userLat, userLng], 13)
    mapInstanceRef.current = map

    // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    // 5-mile radius circle
    const radiusCircle = L.circle([userLat, userLng], {
      radius: 8046.72, // 5 miles in meters
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map)

    radiusCircle.bindPopup(
      '<div class="text-center"><strong>Your 5-mile radius</strong><br/>Stores within your market area</div>'
    )

    // User store marker (pulsing)
    const userIcon = L.divIcon({
      className: 'user-store-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        " class="pulse-marker">
          🏪
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

    const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
    userMarker.bindPopup(
      '<div class="text-center font-semibold"><strong>📍 Your Store</strong><br/>This is where you are!</div>'
    )

    // Count stores by type
    const typeCounts: Record<string, number> = {}
    nearbyStores.forEach((store) => {
      typeCounts[store.type] = (typeCounts[store.type] || 0) + 1
    })

    // Nearby store markers
    nearbyStores.forEach((store, idx) => {
      const typeInfo = STORE_TYPE_COLORS[store.type] || STORE_TYPE_COLORS.other

      const storeIcon = L.divIcon({
        className: 'store-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: ${typeInfo.color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            opacity: 0.9;
          " class="${idx < 20 ? 'pulse-marker' : ''}"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([store.lat, store.lng], { icon: storeIcon }).addTo(map)

      const popupContent = `
        <div class="p-2 min-w-[180px]">
          <div class="font-semibold text-gray-900 mb-1">${store.name}</div>
          <div class="text-xs text-gray-600 mb-2">${typeInfo.label}</div>
          ${
            store.rating
              ? `<div class="text-sm"><span class="font-semibold">${store.rating.toFixed(
                  1
                )}⭐</span> (${store.rating_count} reviews)</div>`
              : '<div class="text-xs text-gray-500">No ratings yet</div>'
          }
        </div>
      `

      marker.bindPopup(popupContent)

      marker.on('click', () => {
        analytics.mapInteracted('store_pin_clicked', {
          store_type: store.type,
          store_rating: store.rating,
        })
      })
    })

    // Legend
    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend')
      div.style.cssText = `
        background: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        font-size: 12px;
        line-height: 1.5;
      `

      let html =
        '<div style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">Store Types</div>'

      Object.entries(STORE_TYPE_COLORS).forEach(([type, info]) => {
        const count = typeCounts[type]
        if (count && count > 0) {
          html += `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <div style="
                width: 12px;
                height: 12px;
                background: ${info.color};
                border: 1px solid white;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              "></div>
              <span style="color: #4b5563;">${info.label} (${count})</span>
            </div>
          `
        }
      })

      html += `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="font-size: 16px;">🏪</div>
            <span style="color: #059669; font-weight: 600;">Your Store</span>
          </div>
        </div>
      `

      div.innerHTML = html
      return div
    }

    legend.addTo(map)

    // Smooth zoom animation to focus on the 5-mile radius circle
    setTimeout(() => {
      const radiusBounds = radiusCircle.getBounds() // Get bounds of the 5-mile radius circle
      map.flyToBounds(radiusBounds, { 
        padding: [50, 50], 
        maxZoom: 14, // Adjust maxZoom to control how close it zooms in
        duration: 1.5 // Smooth animation duration
      })
    }, 100) // Small delay to ensure map is rendered

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      document.head.removeChild(style)
    }
  }, []) // Empty deps because parent controls re-mount via key prop

  return <div ref={mapRef} className="w-full h-full" />
}