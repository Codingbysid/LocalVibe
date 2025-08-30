'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import TrailDisplay from '@/components/TrailDisplay'
import { VibeTrail } from '@/types'
import { MapPin, Star, Heart, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock shared trail data - in production this would come from the database
const mockSharedTrails: Record<string, VibeTrail> = {
  'cozy-brooklyn': {
    narrative: {
      title: "Cozy Brooklyn Afternoon",
      description: "A peaceful journey through quiet cafes and bookstores perfect for reflection and relaxation."
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
      },
      {
        id: '3',
        name: 'Prospect Park',
        address: '789 Park Rd, Brooklyn, NY',
        rating: 4.7,
        user_ratings_total: 2000,
        types: ['park', 'natural_feature'],
        place_id: 'mock_3',
        geometry: { location: { lat: 40.7148, lng: -74.0080 } }
      }
    ]
  },
  'artsy-adventure': {
    narrative: {
      title: "Artsy Adventure in the City",
      description: "Discover creative spaces and artistic inspiration around every corner of Brooklyn."
    },
    stops: [
      {
        id: '4',
        name: 'Modern Art Collective',
        address: '321 Gallery Way, Brooklyn, NY',
        rating: 4.6,
        user_ratings_total: 120,
        types: ['art_gallery', 'museum'],
        place_id: 'mock_4',
        geometry: { location: { lat: 40.7158, lng: -74.0090 } }
      },
      {
        id: '5',
        name: 'Street Art Corner',
        address: '654 Creative Blvd, Brooklyn, NY',
        rating: 4.5,
        user_ratings_total: 95,
        types: ['art_gallery', 'tourist_attraction'],
        place_id: 'mock_5',
        geometry: { location: { lat: 40.7168, lng: -74.0100 } }
      }
    ]
  }
}

export default function SharedTrailPage() {
  const params = useParams()
  const trailId = params.id as string
  const [trail, setTrail] = useState<VibeTrail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call to fetch shared trail
    const fetchTrail = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const foundTrail = mockSharedTrails[trailId]
      
      if (foundTrail) {
        setTrail(foundTrail)
      } else {
        setError('Trail not found')
      }
      
      setIsLoading(false)
    }

    fetchTrail()
  }, [trailId])

  const handleShare = () => {
    const shareText = `Check out this amazing trail: ${trail?.narrative.title} - ${trail?.narrative.description}`
    
    if (navigator.share) {
      navigator.share({
        title: trail?.narrative.title || 'Amazing Trail',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Trail details copied to clipboard!')
    }
  }

  const handleSaveTrail = () => {
    // In production, this would save to the user's account
    alert('Trail saved to your favorites! (Login required)')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading amazing trail...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Trail Not Found</h1>
            <p className="text-gray-600 mb-6">
              The trail you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/" className="btn-primary">
              Discover New Trails
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Discover</span>
            </Link>
          </div>

          {/* Trail Header */}
          <div className="card p-8 mb-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gradient mb-4">
                {trail.narrative.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {trail.narrative.description}
              </p>
            </div>
            
            {/* Trail Stats */}
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{trail.stops.length}</div>
                <div className="text-sm text-gray-500">Stops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {Math.round(trail.stops.reduce((sum, stop) => sum + stop.rating, 0) / trail.stops.length * 10) / 10}
                </div>
                <div className="text-sm text-gray-500">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">~2-3 hrs</div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSaveTrail}
                className="btn-secondary flex items-center space-x-2"
              >
                <Heart className="w-5 h-5" />
                <span>Save Trail</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-primary flex items-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Trail</span>
              </button>
            </div>
          </div>

          {/* Trail Display */}
          <TrailDisplay trail={trail} />
          
          {/* Call to Action */}
          <div className="card p-8 mt-8 text-center bg-gradient-to-r from-primary-50 to-purple-50">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Love This Trail?
            </h3>
            <p className="text-gray-600 mb-6">
              Create your own personalized trails and discover amazing local experiences
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="btn-primary">
                Create Your Own Trail
              </Link>
              <button onClick={handleShare} className="btn-secondary">
                Share with Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
