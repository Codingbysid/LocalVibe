import { TrailRequest, VibeTrail } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function generateTrail(request: TrailRequest): Promise<VibeTrail> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-trail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating trail:', error)
    
    // Return mock data for development/demo purposes
    if (process.env.NODE_ENV === 'development') {
      return getMockTrail(request)
    }
    
    throw error
  }
}

export async function regenerateStop(
  vibes: string[],
  latitude: number,
  longitude: number,
  currentTrail: VibeTrail,
  stopIndex: number
): Promise<{ newStop: any; updatedTrail: VibeTrail }> {
  try {
    const response = await fetch(`${API_BASE_URL}/regenerate-stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vibes,
        latitude,
        longitude,
        current_trail: currentTrail,
        stop_to_replace: stopIndex,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      newStop: data.new_stop,
      updatedTrail: data.updated_trail,
    }
  } catch (error) {
    console.error('Error regenerating stop:', error)
    
    // Return mock data for development/demo purposes
    if (process.env.NODE_ENV === 'development') {
      return getMockRegeneratedStop(vibes, currentTrail, stopIndex)
    }
    
    throw error
  }
}

// Mock trail data for development and demo purposes
function getMockTrail(request: TrailRequest): VibeTrail {
  const vibeDescriptions = {
    cozy: 'A peaceful afternoon perfect for quiet reflection and comfort',
    artsy: 'A creative journey through artistic spaces that inspire imagination',
    historic: 'A timeless adventure through places with rich stories and heritage',
    trendy: 'A modern exploration of cutting-edge contemporary spots',
    nature: 'An outdoor adventure connecting you with natural beauty',
    foodie: 'A culinary journey through unique dining experiences',
    nightlife: 'A vibrant evening filled with energy and excitement',
    hidden: 'An off-the-beaten-path discovery of secret local gems'
  }

  const selectedVibes = request.vibes
  const primaryVibe = selectedVibes[0]
  
  // Generate appropriate mock stops based on vibes
  const mockStops = generateMockStops(selectedVibes, request.latitude, request.longitude)
  
  // Generate narrative based on selected vibes
  const narrative = generateMockNarrative(selectedVibes, mockStops)
  
  return {
    narrative,
    stops: mockStops
  }
}

// Mock regenerated stop data
function getMockRegeneratedStop(
  vibes: string[],
  currentTrail: VibeTrail,
  stopIndex: number
): { newStop: any; updatedTrail: VibeTrail } {
  // Create alternative mock stops for the specific vibe
  const alternativeStops = generateMockStops(vibes, 40.7128, -74.0060)
  
  // Select a different stop than the current one
  const currentStop = currentTrail.stops[stopIndex]
  const newStop = alternativeStops.find(stop => 
    stop.name !== currentStop.name && 
    !currentTrail.stops.some(existing => existing.name === stop.name)
  ) || alternativeStops[0]
  
  // Create updated trail
  const updatedTrail = {
    ...currentTrail,
    stops: [...currentTrail.stops]
  }
  updatedTrail.stops[stopIndex] = newStop
  
  // Update narrative
  updatedTrail.narrative = generateMockNarrative(vibes, updatedTrail.stops)
  
  return {
    newStop,
    updatedTrail
  }
}

function generateMockStops(vibes: string[], lat: number, lng: number): any[] {
  const baseStops = [
    {
      id: '1',
      name: 'The Daily Press',
      address: '123 Main St, Brooklyn, NY',
      rating: 4.8,
      user_ratings_total: 150,
      types: ['cafe', 'restaurant'],
      place_id: 'mock_place_1',
      geometry: {
        location: {
          lat: lat + 0.001,
          lng: lng + 0.001
        }
      }
    },
    {
      id: '2',
      name: 'Better Read Than Dead',
      address: '456 Oak Ave, Brooklyn, NY',
      rating: 4.9,
      user_ratings_total: 80,
      types: ['book_store'],
      place_id: 'mock_place_2',
      geometry: {
        location: {
          lat: lat + 0.002,
          lng: lng + 0.002
        }
      }
    },
    {
      id: '3',
      name: 'Prospect Park',
      address: '789 Park Rd, Brooklyn, NY',
      rating: 4.7,
      user_ratings_total: 2000,
      types: ['park', 'natural_feature'],
      place_id: 'mock_place_3',
      geometry: {
        location: {
          lat: lat + 0.003,
          lng: lng + 0.003
        }
      }
    }
  ]

  // Add vibe-specific stops
  if (vibes.includes('artsy')) {
    baseStops.push({
      id: '4',
      name: 'Modern Art Collective',
      address: '321 Gallery Way, Brooklyn, NY',
      rating: 4.6,
      user_ratings_total: 120,
      types: ['art_gallery', 'museum'],
      place_id: 'mock_place_4',
      geometry: {
        location: {
          lat: lat + 0.004,
          lng: lng + 0.004
        }
      }
    })
  }

  if (vibes.includes('foodie')) {
    baseStops.push({
      id: '5',
      name: 'Farm-to-Table Bistro',
      address: '654 Fresh St, Brooklyn, NY',
      rating: 4.9,
      user_ratings_total: 95,
      types: ['restaurant', 'food'],
      place_id: 'mock_place_5',
      geometry: {
        location: {
          lat: lat + 0.005,
          lng: lng + 0.005
        }
      }
    })
  }

  // Add more alternative stops for shuffle feature
  baseStops.push(
    {
      id: '6',
      name: 'Cozy Corner Cafe',
      address: '111 Peaceful Lane, Brooklyn, NY',
      rating: 4.7,
      user_ratings_total: 85,
      types: ['cafe', 'restaurant'],
      place_id: 'mock_place_6',
      geometry: {
        location: {
          lat: lat + 0.006,
          lng: lng + 0.006
        }
      }
    },
    {
      id: '7',
      name: 'Urban Garden Oasis',
      address: '222 Green Street, Brooklyn, NY',
      rating: 4.5,
      user_ratings_total: 65,
      types: ['park', 'garden'],
      place_id: 'mock_place_7',
      geometry: {
        location: {
          lat: lat + 0.007,
          lng: lng + 0.007
        }
      }
    },
    {
      id: '8',
      name: 'Vintage Book Nook',
      address: '333 Literary Lane, Brooklyn, NY',
      rating: 4.8,
      user_ratings_total: 45,
      types: ['book_store', 'antique_shop'],
      place_id: 'mock_place_8',
      geometry: {
        location: {
          lat: lat + 0.008,
          lng: lng + 0.008
        }
      }
    }
  )

  return baseStops.slice(0, 4) // Return max 4 stops
}

function generateMockNarrative(vibes: string[], stops: any[]): { title: string, description: string } {
  const vibeNames = vibes.map(vibe => {
    const names = {
      cozy: 'Cozy',
      artsy: 'Artsy',
      historic: 'Historic',
      trendy: 'Trendy',
      nature: 'Nature-filled',
      foodie: 'Foodie',
      nightlife: 'Vibrant',
      hidden: 'Hidden Gem'
    }
    return names[vibe as keyof typeof names] || vibe
  })

  const location = 'Brooklyn'
  
  let title = ''
  let description = ''

  if (vibes.length === 1) {
    const vibe = vibes[0]
    switch (vibe) {
      case 'cozy':
        title = `A ${vibeNames[0]} Brooklyn Afternoon`
        description = `Unwind with the perfect peaceful experience in ${location}. This trail takes you through quiet, comfortable spaces perfect for reflection and relaxation.`
        break
      case 'artsy':
        title = `Creative ${location} Adventure`
        description = `Immerse yourself in ${location}'s artistic spirit with this curated trail of creative spaces that will inspire your imagination.`
        break
      case 'historic':
        title = `${vibeNames[0]} ${location} Journey`
        description = `Step back in time and discover ${location}'s rich heritage through this carefully selected trail of timeless landmarks and stories.`
        break
      default:
        title = `${vibeNames[0]} ${location} Experience`
        description = `Discover the perfect ${vibe} experience in ${location} with this thoughtfully curated trail of local favorites.`
    }
  } else {
    title = `${vibeNames.slice(0, 2).join(' & ')} ${location} Trail`
    description = `Experience the best of both worlds with this unique trail that combines ${vibeNames.slice(0, 2).join(' and ')} vibes in ${location}.`
  }

  return { title, description }
}
