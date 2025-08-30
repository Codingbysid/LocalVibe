export interface VibeTrail {
  narrative: {
    title: string
    description: string
  }
  stops: TrailStop[]
}

export interface TrailStop {
  id: string
  name: string
  address: string
  rating: number
  user_ratings_total: number
  types: string[]
  photos?: string[]
  place_id: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export interface TrailRequest {
  vibes: string[]
  latitude: number
  longitude: number
}

export interface VibeOption {
  id: string
  name: string
  emoji: string
  description: string
  color: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface SavedTrail {
  id: string
  user_id: string
  trail_data: VibeTrail
  created_at: string
  vibes: string[]
}
