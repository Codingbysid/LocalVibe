'use client'

import Header from '@/components/Header'
import { MapPin, Sparkles, Route, Heart, Share2, ArrowRight } from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: "Choose Your Vibe",
      description: "Select from 8 curated vibes that match your mood - from cozy cafes to artsy adventures.",
      details: "Pick one or combine multiple vibes like 'Cozy & Artsy' for a perfect blend of experiences."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: "AI Curates Your Trail",
      description: "Our smart algorithm finds the best local spots that match your vibe and location.",
      details: "We analyze ratings, proximity, and vibe compatibility to create the perfect walking route."
    },
    {
      icon: <Route className="w-8 h-8 text-green-600" />,
      title: "Discover Hidden Gems",
      description: "Explore unique local spots you'd never find through generic search.",
      details: "Each stop is carefully selected to provide an authentic, local experience."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Save & Share",
      description: "Save your favorite trails and share amazing discoveries with friends.",
      details: "Build your personal collection of adventures and become a local expert."
    }
  ]

  const features = [
    {
      title: "Personalized Discovery",
      description: "Every trail is unique to your mood, location, and preferences."
    },
    {
      title: "Local Expertise",
      description: "Discover spots that locals love, not just tourist traps."
    },
    {
      title: "Walkable Routes",
      description: "All stops are within comfortable walking distance of each other."
    },
    {
      title: "AI-Powered Stories",
      description: "Each trail comes with a narrative that makes your adventure feel special."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gradient mb-6">
              How LocalVibe Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform how you discover local experiences with AI-curated trails that match your mood and location.
            </p>
          </div>

          {/* How It Works Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Your Adventure in 4 Simple Steps
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="card p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    {step.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why LocalVibe is Different
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="card p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Example Trail */}
          <div className="card p-8 bg-gradient-to-r from-primary-50 to-purple-50">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              See It in Action
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-gradient mb-4">
                  "Cozy & Artsy Brooklyn Afternoon"
                </h3>
                <p className="text-gray-600 mb-6">
                  A peaceful journey through quiet cafes and indie galleries, perfect for reflection and creative inspiration.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">☕</div>
                    <div className="font-semibold text-gray-800">The Daily Press</div>
                    <div className="text-sm text-gray-500">Cozy cafe with great coffee</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="font-semibold text-gray-800">Modern Art Collective</div>
                    <div className="text-sm text-gray-500">Indie art gallery</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-semibold text-gray-800">Better Read Than Dead</div>
                    <div className="text-sm text-gray-500">Quiet bookstore</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <a href="/" className="btn-primary inline-flex items-center space-x-2">
                    <span>Try LocalVibe Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  How accurate are the trail recommendations?
                </h3>
                <p className="text-gray-600">
                  Our AI algorithm analyzes multiple factors including ratings, proximity, vibe compatibility, and local popularity to ensure high-quality recommendations.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Can I customize my trail?
                </h3>
                <p className="text-gray-600">
                  Yes! You can shuffle individual stops to get alternatives, and combine multiple vibes for a personalized experience.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Are the trails walkable?
                </h3>
                <p className="text-gray-600">
                  Absolutely! All stops are carefully selected to be within comfortable walking distance, typically 1-2 miles total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
