'use client'

import { useEffect, useRef, useState } from 'react'
import { TrailStop } from '@/types'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface TrailMapProps {
  stops: TrailStop[]
}

export default function TrailMap({ stops }: TrailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    
    if (!mapboxToken) {
      console.error('Mapbox token not found')
      return
    }

    mapboxgl.accessToken = mapboxToken

    // Calculate center point from all stops
    const centerLat = stops.reduce((sum, stop) => sum + stop.geometry.location.lat, 0) / stops.length
    const centerLng = stops.reduce((sum, stop) => sum + stop.geometry.location.lng, 0) / stops.length

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [centerLng, centerLat],
      zoom: 13
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [stops])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Clear existing markers and sources
    if (map.current.getLayer('route')) map.current.removeLayer('route')
    if (map.current.getSource('route')) map.current.removeSource('route')
    
    // Add markers for each stop
    stops.forEach((stop, index) => {
      const marker = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 0.8
      })
        .setLngLat([stop.geometry.location.lng, stop.geometry.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${index + 1}. ${stop.name}</h3>
                <p class="text-sm text-gray-600">${stop.address}</p>
                <div class="flex items-center mt-1">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm ml-1">${stop.rating}</span>
                </div>
              </div>
            `)
        )
        .addTo(map.current!)

      // Add stop number label
      new mapboxgl.Marker({
        element: createStopLabel(index + 1),
        anchor: 'center'
      })
        .setLngLat([stop.geometry.location.lng, stop.geometry.location.lat])
        .addTo(map.current!)
    })

    // Draw route lines between stops
    if (stops.length > 1) {
      const coordinates = stops.map(stop => [
        stop.geometry.location.lng,
        stop.geometry.location.lat
      ])

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      })

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      })
    }

    // Fit map to show all stops
    const bounds = new mapboxgl.LngLatBounds()
    stops.forEach(stop => {
      bounds.extend([stop.geometry.location.lng, stop.geometry.location.lat])
    })
    map.current.fitBounds(bounds, { padding: 50 })

  }, [stops, mapLoaded])

  const createStopLabel = (number: number) => {
    const el = document.createElement('div')
    el.className = 'stop-label'
    el.innerHTML = `
      <div class="w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shadow-lg">
        ${number}
      </div>
    `
    return el
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">🗺️</div>
          <p className="text-sm text-gray-500">Mapbox token required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  )
}
