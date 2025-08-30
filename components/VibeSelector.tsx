'use client'

import { useState } from 'react'
import { VibeOption } from '@/types'

const vibes: VibeOption[] = [
  { 
    id: 'cozy', 
    name: 'Cozy & Quiet', 
    emoji: '☕', 
    description: 'Peaceful spots for reflection and comfort',
    detailedDescription: 'Discover intimate cafes, quiet bookstores, and serene spaces perfect for unwinding and finding your inner peace. Perfect for introverts and those seeking tranquility.',
    color: 'bg-vibe-cozy'
  },
  { 
    id: 'artsy', 
    name: 'Artsy & Creative', 
    emoji: '🎨', 
    description: 'Creative spaces that inspire imagination',
    detailedDescription: 'Explore indie galleries, street art installations, craft studios, and creative workshops that will spark your artistic inspiration and creative energy.',
    color: 'bg-vibe-artsy'
  },
  { 
    id: 'historic', 
    name: 'Historic & Classic', 
    emoji: '🏛️', 
    description: 'Timeless places with rich stories',
    detailedDescription: 'Step back in time to discover historic landmarks, classic architecture, museums, and heritage sites that tell the fascinating stories of your city.',
    color: 'bg-vibe-historic'
  },
  { 
    id: 'trendy', 
    name: 'Trendy & Modern', 
    emoji: '✨', 
    description: 'Contemporary spots with cutting-edge vibes',
    detailedDescription: 'Experience the latest trends in dining, fashion, and culture at hip cafes, boutique shops, and modern venues that define contemporary urban style.',
    color: 'bg-vibe-trendy'
  },
  { 
    id: 'nature', 
    name: 'Nature & Outdoors', 
    emoji: '🌳', 
    description: 'Green spaces and outdoor adventures',
    detailedDescription: 'Connect with nature through beautiful parks, botanical gardens, hiking trails, and outdoor spaces that offer fresh air and natural beauty in the city.',
    color: 'bg-vibe-nature'
  },
  { 
    id: 'foodie', 
    name: 'Foodie Paradise', 
    emoji: '🍽️', 
    description: 'Culinary delights and unique dining experiences',
    detailedDescription: 'Embark on a culinary journey through unique restaurants, food markets, artisanal bakeries, and hidden gems that showcase the best local flavors.',
    color: 'bg-vibe-cozy'
  },
  { 
    id: 'nightlife', 
    name: 'Nightlife & Energy', 
    emoji: '🌙', 
    description: 'Vibrant evening spots with great energy',
    detailedDescription: 'Experience the city after dark with lively bars, live music venues, entertainment spots, and vibrant nightlife destinations that come alive when the sun sets.',
    color: 'bg-vibe-trendy'
  },
  { 
    id: 'hidden', 
    name: 'Hidden Gems', 
    emoji: '💎', 
    description: 'Off-the-beaten-path discoveries',
    detailedDescription: 'Uncover the city\'s best-kept secrets - local favorites, neighborhood spots, and hidden treasures that most tourists never discover but locals love.',
    color: 'bg-vibe-artsy'
  }
]

interface VibeSelectorProps {
  onGenerate: (vibes: string[]) => void
  isLoading: boolean
}

export default function VibeSelector({ onGenerate, isLoading }: VibeSelectorProps) {
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set())
  const [hoveredVibe, setHoveredVibe] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleSelectVibe = (vibeId: string) => {
    const newSelection = new Set(selectedVibes)
    if (newSelection.has(vibeId)) {
      newSelection.delete(vibeId)
    } else {
      newSelection.add(vibeId)
    }
    setSelectedVibes(newSelection)
  }

  const handleGenerateClick = () => {
    if (selectedVibes.size === 0) return
    onGenerate(Array.from(selectedVibes))
  }

  const handleVibeHover = (vibeId: string, event: React.MouseEvent) => {
    setHoveredVibe(vibeId)
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }

  const handleVibeLeave = () => {
    setHoveredVibe(null)
  }

  const getVibeById = (id: string) => vibes.find(vibe => vibe.id === id)

  return (
    <div className="card p-8 max-w-4xl mx-auto relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Choose Your Vibe
        </h2>
        <p className="text-gray-600">
          Select one or more vibes that match your mood today. We'll create a perfect trail just for you.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {vibes.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => handleSelectVibe(vibe.id)}
            onMouseEnter={(e) => handleVibeHover(vibe.id, e)}
            onMouseLeave={handleVibeLeave}
            className={`vibe-card ${selectedVibes.has(vibe.id) ? 'selected' : ''}`}
          >
            <div className="text-4xl mb-3">{vibe.emoji}</div>
            <div className="font-semibold text-gray-700 mb-2">{vibe.name}</div>
            <div className="text-sm text-gray-500">{vibe.description}</div>
          </button>
        ))}
      </div>

      {/* Interactive Tooltip */}
      {hoveredVibe && (
        <div 
          className="absolute z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{getVibeById(hoveredVibe)?.emoji}</span>
            <span className="font-semibold">{getVibeById(hoveredVibe)?.name}</span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            {getVibeById(hoveredVibe)?.detailedDescription}
          </p>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleGenerateClick}
          disabled={selectedVibes.size === 0 || isLoading}
          className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Your Trail...</span>
            </div>
          ) : (
            `Generate My ${selectedVibes.size > 1 ? 'Trail' : 'Vibe'}`
          )}
        </button>
        
        {selectedVibes.size > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              You've selected {selectedVibes.size} vibe{selectedVibes.size > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from(selectedVibes).map(vibeId => {
                const vibe = getVibeById(vibeId)
                return (
                  <span
                    key={vibeId}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    <span>{vibe?.emoji}</span>
                    <span>{vibe?.name}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
