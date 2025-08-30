'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import VibeSelector from '@/components/VibeSelector'
import TrailDisplay from '@/components/TrailDisplay'
import VibeOfTheDay from '@/components/VibeOfTheDay'
import WelcomeModal from '@/components/WelcomeModal'
import { VibeTrail } from '@/types'
import { generateTrail } from '@/lib/api'
import { getCurrentUser, saveTrail, getUserTrails } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name: string
}

export default function Home() {
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  const [currentTrail, setCurrentTrail] = useState<VibeTrail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [vibeOfTheDay, setVibeOfTheDay] = useState<VibeTrail | null>(null)
  const [showVibeOfTheDay, setShowVibeOfTheDay] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [savedTrails, setSavedTrails] = useState<VibeTrail[]>([])

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('localvibe_has_visited')
    if (!hasVisited) {
      setShowWelcomeModal(true)
      localStorage.setItem('localvibe_has_visited', 'true')
    }

    // Check for existing user session
    const savedUser = localStorage.getItem('localvibe_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
      }
    }

    // Load saved trails
    const savedTrailsData = localStorage.getItem('localvibe_saved_trails')
    if (savedTrailsData) {
      try {
        setSavedTrails(JSON.parse(savedTrailsData))
      } catch (error) {
        console.error('Error parsing saved trails:', error)
      }
    }

    // Get user location on page load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          
          // Generate Vibe of the Day after getting location
          generateVibeOfTheDay(location)
        },
        (error) => {
          console.log('Error getting location:', error)
          // Default to NYC coordinates if location access is denied
          const defaultLocation = { lat: 40.7128, lng: -74.0060 }
          setUserLocation(defaultLocation)
          generateVibeOfTheDay(defaultLocation)
        }
      )
    } else {
      // Fallback to NYC coordinates
      const defaultLocation = { lat: 40.7128, lng: -74.0060 }
      setUserLocation(defaultLocation)
      generateVibeOfTheDay(defaultLocation)
    }
  }, [])

  const generateVibeOfTheDay = async (location: {lat: number, lng: number}) => {
    try {
      // Use a rotating vibe of the day (you can make this more sophisticated)
      const vibesOfTheDay = [
        ['hidden', 'local'],
        ['foodie', 'trendy'],
        ['cozy', 'artsy'],
        ['nature', 'historic'],
        ['nightlife', 'vibrant']
      ]
      
      const today = new Date()
      const dayOfWeek = today.getDay()
      const todaysVibes = vibesOfTheDay[dayOfWeek] || ['cozy', 'local']
      
      const trail = await generateTrail({
        vibes: todaysVibes,
        latitude: location.lat,
        longitude: location.lng
      })
      
      setVibeOfTheDay(trail)
    } catch (error) {
      console.error('Error generating vibe of the day:', error)
    }
  }

  const handleGenerateTrail = async (vibes: string[]) => {
    if (!userLocation) {
      alert('Please allow location access to generate trails')
      return
    }

    setIsLoading(true)
    setSelectedVibes(vibes)
    
    try {
      const trail = await generateTrail({
        vibes,
        latitude: userLocation.lat,
        longitude: userLocation.lng
      })
      setCurrentTrail(trail)
      setShowVibeOfTheDay(false) // Hide vibe of the day when user generates their own
    } catch (error) {
      console.error('Error generating trail:', error)
      alert('Failed to generate trail. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentTrail(null)
    setSelectedVibes([])
    setShowVibeOfTheDay(true) // Show vibe of the day again
  }

  const handleTryVibeOfTheDay = () => {
    if (vibeOfTheDay) {
      setCurrentTrail(vibeOfTheDay)
      setShowVibeOfTheDay(false)
    }
  }

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
  }

  const handleSaveTrail = async (trail: VibeTrail) => {
    if (!user) {
      alert('Please sign in to save trails')
      return
    }

    try {
      // Save to Supabase database
      const { data, error } = await saveTrail(user.id, {
        ...trail,
        vibes: selectedVibes
      })

      if (error) {
        console.error('Error saving trail:', error)
        alert('Failed to save trail. Please try again.')
        return
      }

      // Update local state
      const newSavedTrails = [...savedTrails, trail]
      setSavedTrails(newSavedTrails)
      
      // Also save to localStorage as backup
      localStorage.setItem('localvibe_saved_trails', JSON.stringify(newSavedTrails))
      
      alert('Trail saved successfully!')
    } catch (error) {
      console.error('Error saving trail:', error)
      alert('Failed to save trail. Please try again.')
    }
  }

  const isCurrentTrailSaved = () => {
    if (!currentTrail) return false
    return savedTrails.some(savedTrail => 
      savedTrail.narrative.title === currentTrail.narrative.title &&
      savedTrail.stops.length === currentTrail.stops.length
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!currentTrail ? (
          <div className="max-w-4xl mx-auto">
            {/* Vibe of the Day Section */}
            {showVibeOfTheDay && vibeOfTheDay && (
              <VibeOfTheDay 
                trail={vibeOfTheDay} 
                onTryTrail={handleTryVibeOfTheDay}
                onDismiss={() => setShowVibeOfTheDay(false)}
              />
            )}
            
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gradient mb-6">
                What's Your Vibe Today?
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stop searching, start experiencing. Let AI curate the perfect local adventure 
                based on your mood and location.
              </p>
            </div>
            
            <VibeSelector 
              onGenerate={handleGenerateTrail}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <button
                onClick={handleReset}
                className="btn-secondary mb-4"
              >
                ← Generate New Trail
              </button>
              <h2 className="text-3xl font-bold text-gray-800">
                Your {currentTrail.narrative.title}
              </h2>
            </div>
            
            <TrailDisplay 
              trail={currentTrail}
              userLocation={userLocation}
              selectedVibes={selectedVibes}
              onSaveTrail={handleSaveTrail}
              isSaved={isCurrentTrailSaved()}
            />
          </div>
        )}
      </div>

      {/* Welcome Modal for First-Time Visitors */}
      {showWelcomeModal && (
        <WelcomeModal onClose={handleCloseWelcomeModal} />
      )}
    </main>
  )
}
