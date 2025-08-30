'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Heart, MapPin, Star, Calendar, Trash2, Share2, Play } from 'lucide-react'
import { VibeTrail } from '@/types'

// Mock saved trails data
const mockSavedTrails: VibeTrail[] = [
  {
    narrative: {
      title: "Cozy Brooklyn Afternoon",
      description: "A peaceful journey through quiet cafes and bookstores perfect for reflection."
    },
    stops: [
      {
        id: '1',
        name: 'The Daily Press',
        address: '123 Main St, Brooklyn, NY',
        rating: 4.8,
        user_ratings_total: 150,
        types: ['cafe', 'restaurant'],
        place_id: 'mock_1',
        geometry: { location: { lat: 40.7128, lng: -74.0060 } }
      },
      {
        id: '2',
        name: 'Better Read Than Dead',
        address: '456 Oak Ave, Brooklyn, NY',
        rating: 4.9,
        user_ratings_total: 80,
        types: ['book_store'],
        place_id: 'mock_2',
        geometry: { location: { lat: 40.7138, lng: -74.0070 } }
      }
    ]
  },
  {
    narrative: {
      title: "Artsy Adventure in the City",
      description: "Discover creative spaces and artistic inspiration around every corner."
    },
    stops: [
      {
        id: '3',
        name: 'Modern Art Collective',
        address: '321 Gallery Way, Brooklyn, NY',
        rating: 4.6,
        user_ratings_total: 120,
        types: ['art_gallery', 'museum'],
        place_id: 'mock_3',
        geometry: { location: { lat: 40.7148, lng: -74.0080 } }
      }
    ]
  }
]

export default function SavedTrailsPage() {
  const [savedTrails, setSavedTrails] = useState<VibeTrail[]>(mockSavedTrails)
  const [selectedTrail, setSelectedTrail] = useState<VibeTrail | null>(null)

  const handleDeleteTrail = (trailIndex: number) => {
    if (confirm('Are you sure you want to delete this trail?')) {
      const newTrails = savedTrails.filter((_, index) => index !== trailIndex)
      setSavedTrails(newTrails)
    }
  }

  const handleShareTrail = (trail: VibeTrail) => {
    // In production, this would generate a shareable URL
    const shareText = `Check out this amazing trail: ${trail.narrative.title} - ${trail.narrative.description}`
    
    if (navigator.share) {
      navigator.share({
        title: trail.narrative.title,
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Trail details copied to clipboard!')
    }
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

  const formatTypes = (types: string[]) => {
    return types
      .map(type => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      .slice(0, 2)
      .join(' • ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Saved Trails</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your collection of favorite adventures and trails to explore
            </p>
          </div>

          {savedTrails.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Saved Trails Yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring and save your favorite trails to revisit later
              </p>
              <a
                href="/"
                className="btn-primary"
              >
                Discover Trails
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {savedTrails.map((trail, trailIndex) => (
                <div key={trailIndex} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {trail.narrative.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {trail.narrative.description}
                      </p>
                      
                      {/* Trail Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{trail.stops.length} stops</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Saved 2 days ago</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>Avg: 4.7/5</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedTrail(trail)}
                        className="btn-primary flex items-center space-x-2"
                        title="View Trail"
                      >
                        <Play className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      
                      <button
                        onClick={() => handleShareTrail(trail)}
                        className="btn-secondary p-2"
                        title="Share Trail"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTrail(trailIndex)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Trail"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Trail Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Trail Preview:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {trail.stops.map((stop, stopIndex) => (
                        <div key={stop.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-lg">
                            {getStopEmoji(stop.types)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-800 text-sm truncate">
                              {stopIndex + 1}. {stop.name}
                            </h5>
                            <p className="text-xs text-gray-500 truncate">
                              {formatTypes(stop.types)}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{stop.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
