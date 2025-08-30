'use client'

import { useState, useEffect } from 'react'
import { VibeTrail, TrailStop } from '@/types'
import { MapPin, Star, Clock, Heart, Share2, Shuffle, ChevronDown, ChevronUp, Check, Navigation, Route } from 'lucide-react'
import dynamic from 'next/dynamic'
import { regenerateStop } from '@/lib/api'

// Dynamically import the map component to avoid SSR issues
const TrailMap = dynamic(() => import('./TrailMap'), { ssr: false })

interface TrailDisplayProps {
  trail: VibeTrail
  userLocation?: { lat: number; lng: number }
  selectedVibes?: string[]
  onSaveTrail?: (trail: VibeTrail) => void
  isSaved?: boolean
}

export default function TrailDisplay({ 
  trail, 
  userLocation, 
  selectedVibes, 
  onSaveTrail,
  isSaved = false 
}: TrailDisplayProps) {
  const [selectedStop, setSelectedStop] = useState<TrailStop | null>(null)
  const [expandedStops, setExpandedStops] = useState<Set<number>>(new Set())
  const [shufflingStop, setShufflingStop] = useState<number | null>(null)
  const [currentTrail, setCurrentTrail] = useState<VibeTrail>(trail)
  const [directions, setDirections] = useState<any>(null)
  const [loadingDirections, setLoadingDirections] = useState(false)
  const [showDirections, setShowDirections] = useState(false)
  const [saved, setSaved] = useState(isSaved)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Fetch walking directions between stops
  const fetchDirections = async () => {
    if (currentTrail.stops.length < 2) return
    
    setLoadingDirections(true)
    try {
      const coordinates = currentTrail.stops.map(stop => ({
        lat: stop.geometry.location.lat,
        lng: stop.geometry.location.lng
      }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/directions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      })

      if (response.ok) {
        const directionsData = await response.json()
        setDirections(directionsData)
      } else {
        console.error('Failed to fetch directions')
      }
    } catch (error) {
      console.error('Error fetching directions:', error)
    } finally {
      setLoadingDirections(false)
    }
  }

  // Auto-fetch directions when trail changes
  useEffect(() => {
    if (currentTrail.stops.length >= 2) {
      fetchDirections()
    }
  }, [currentTrail.stops])

  const formatTypes = (types: string[]) => {
    return types
      .map(type => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      .slice(0, 3)
      .join(' • ')
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

  const toggleStopExpansion = (stopIndex: number) => {
    const newExpanded = new Set(expandedStops)
    if (newExpanded.has(stopIndex)) {
      newExpanded.delete(stopIndex)
    } else {
      newExpanded.add(stopIndex)
    }
    setExpandedStops(newExpanded)
  }

  const handleShuffleStop = async (stopIndex: number) => {
    if (!userLocation || !selectedVibes) {
      alert('Location and vibes are required to shuffle stops')
      return
    }

    setShufflingStop(stopIndex)
    
    try {
      const result = await regenerateStop(
        selectedVibes,
        userLocation.lat,
        userLocation.lng,
        currentTrail,
        stopIndex
      )
      
      setCurrentTrail(result.updatedTrail)
      setSelectedStop(null) // Close any open stop details
      
      // Show success feedback
      const stopName = result.newStop.name
      console.log(`Successfully shuffled to: ${stopName}`)
      
    } catch (error) {
      console.error('Error shuffling stop:', error)
      alert('Failed to shuffle stop. Please try again.')
    } finally {
      setShufflingStop(null)
    }
  }

  const handleSaveTrail = () => {
    if (onSaveTrail) {
      onSaveTrail(currentTrail)
      setSaved(true)
    } else {
      // Fallback for when not in authenticated context
      alert('Please sign in to save trails')
    }
  }

  const handleShareTrail = () => {
    setShowShareOptions(!showShareOptions)
  }

  const copyTrailLink = () => {
    // In production, this would generate a unique trail URL
    const trailData = {
      title: currentTrail.narrative.title,
      description: currentTrail.narrative.description,
      stops: currentTrail.stops.map(stop => ({
        name: stop.name,
        address: stop.address,
        rating: stop.rating
      }))
    }
    
    const shareText = `Check out this amazing trail: ${trailData.title}\n\n${trailData.description}\n\nStops:\n${trailData.stops.map((stop, i) => `${i + 1}. ${stop.name} (${stop.rating}/5)`).join('\n')}`
    
    navigator.clipboard.writeText(shareText)
    alert('Trail details copied to clipboard!')
    setShowShareOptions(false)
  }

  const shareToSocial = (platform: string) => {
    const shareText = `Check out this amazing trail: ${currentTrail.narrative.title} - ${currentTrail.narrative.description}`
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank')
    setShowShareOptions(false)
  }

  const getStopDetails = (stop: TrailStop) => {
    // Mock detailed information - in production this would come from an API
    const mockDetails = {
      openingHours: 'Mon-Fri: 8AM-6PM, Sat-Sun: 9AM-7PM',
      phone: '+1 (555) 123-4567',
      website: 'https://example.com',
      priceRange: '$$',
      popularTimes: 'Peak: 2-4 PM',
      features: ['WiFi', 'Outdoor Seating', 'Wheelchair Accessible'],
      recentReviews: [
        { text: 'Amazing atmosphere and great coffee!', rating: 5, author: 'Sarah M.' },
        { text: 'Perfect spot for working remotely', rating: 4, author: 'Mike R.' },
        { text: 'Love the local vibe here', rating: 5, author: 'Emma L.' }
      ]
    }
    
    return mockDetails
  }

  return (
    <div className="space-y-8">
      {/* Trail Narrative */}
      <div className="card p-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          {currentTrail.narrative.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {currentTrail.narrative.description}
        </p>
        
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleSaveTrail}
            className={`btn-secondary flex items-center space-x-2 ${
              saved ? 'bg-green-50 border-green-500 text-green-700' : ''
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Save Trail</span>
              </>
            )}
          </button>
          
          <div className="relative">
            <button
              onClick={handleShareTrail}
              className="btn-secondary flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            
            {/* Share Options Dropdown */}
            {showShareOptions && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share on WhatsApp
                </button>
                <button
                  onClick={copyTrailLink}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Copy Trail Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Walking Directions */}
      {directions && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Route className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Walking Route</h3>
                <p className="text-sm text-gray-600">
                  {directions.formatted_distance} • {directions.formatted_duration}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span className="text-sm font-medium">
                {showDirections ? 'Hide' : 'Show'} Directions
              </span>
              {showDirections ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {showDirections && (
            <div className="space-y-3">
              {directions.steps.map((step: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Navigation className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{step.instruction}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(step.distance)}m • {Math.round(step.duration / 60)} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map and Stops */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map */}
        <div className="card p-6 h-96">
          <h3 className="text-xl font-semibold mb-4">Your Trail Map</h3>
          <TrailMap stops={currentTrail.stops} />
        </div>

        {/* Stops List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Trail Stops</h3>
          {currentTrail.stops.map((stop, index) => {
            const isExpanded = expandedStops.has(index)
            const isShuffling = shufflingStop === index
            const stopDetails = getStopDetails(stop)
            
            return (
              <div
                key={stop.id}
                className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedStop?.id === stop.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                      {getStopEmoji(stop.types)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {index + 1}. {stop.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{stop.rating}</span>
                        <span className="text-xs text-gray-400">({stop.user_ratings_total})</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {formatTypes(stop.types)}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{stop.address}</span>
                    </div>
                  </div>
                  
                  {/* Shuffle Button */}
                  {userLocation && selectedVibes && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShuffleStop(index)
                      }}
                      disabled={isShuffling}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                      title="Shuffle this stop"
                    >
                      {isShuffling ? (
                        <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Shuffle className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Expandable Details */}
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStopExpansion(index)
                    }}
                    className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show More Details</span>
                      </>
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Basic Info</h5>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{stopDetails.openingHours}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Price:</span>
                              <span>{stopDetails.priceRange}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Peak Hours:</span>
                              <span>{stopDetails.popularTimes}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Features</h5>
                          <div className="flex flex-wrap gap-2">
                            {stopDetails.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Reviews */}
                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Recent Reviews</h5>
                        <div className="space-y-2">
                          {stopDetails.recentReviews.slice(0, 2).map((review, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="flex items-center space-x-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">by {review.author}</span>
                              </div>
                              <p className="text-sm text-gray-700">{review.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trail Summary */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Explore?</h3>
          <p className="text-gray-600 mb-4">
            Your personalized trail is ready! This adventure includes {currentTrail.stops.length} unique stops 
            that perfectly match your vibe.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary">
              Get Directions
            </button>
            <button className="btn-secondary">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
