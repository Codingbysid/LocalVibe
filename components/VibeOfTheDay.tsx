'use client'

import { useState } from 'react'
import { VibeTrail } from '@/types'
import { MapPin, Star, X, Play } from 'lucide-react'

interface VibeOfTheDayProps {
  trail: VibeTrail
  onTryTrail: () => void
  onDismiss: () => void
}

export default function VibeOfTheDay({ trail, onTryTrail, onDismiss }: VibeOfTheDayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
  }

  const getStopEmoji = (types: string[]) => {
    if (types.includes('cafe') || types.includes('restaurant')) return '☕'
    if (types.includes('park')) return '🌳'
    if (types.includes('book_store')) return '📚'
    if (types.includes('museum')) return '🏛️'
    if (types.includes('art_gallery')) return '🎨'
    if (types.includes('bar')) return '🍺'
    return '📍'
  }

  return (
    <div className="card p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🎯</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {getDayName()}'s Vibe of the Day
              </h2>
              <p className="text-sm text-gray-600">Curated just for you</p>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gradient mb-2">
            {trail.narrative.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {trail.narrative.description}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onTryTrail}
            className="btn-primary flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Try This Trail</span>
          </button>
          <button
            onClick={onDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trail Preview */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Trail Preview:</h4>
        <div className="space-y-2">
          {trail.stops.slice(0, 3).map((stop, index) => (
            <div key={stop.id} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-600">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStopEmoji(stop.types)}</span>
                  <span className="font-medium text-gray-800">{stop.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{stop.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{stop.address}</span>
                </div>
              </div>
            </div>
          ))}
          {trail.stops.length > 3 && (
            <div className="text-center text-sm text-gray-500 pt-2">
              +{trail.stops.length - 3} more stops
            </div>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
        </button>
        
        {isExpanded && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2">Why This Trail?</h5>
            <p className="text-sm text-gray-600 mb-3">
              We've selected this combination of vibes because it's perfect for {getDayName().toLowerCase()}s - 
              whether you're looking to unwind, explore, or discover something new in your area.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="font-medium text-gray-700">Total Distance:</span>
                <span className="ml-2 text-gray-600">~1.2 miles</span>
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-700">Estimated Time:</span>
                <span className="ml-2 text-gray-600">2-3 hours</span>
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-700">Best Time:</span>
                <span className="ml-2 text-gray-600">Afternoon</span>
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-700">Difficulty:</span>
                <span className="ml-2 text-gray-600">Easy</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
