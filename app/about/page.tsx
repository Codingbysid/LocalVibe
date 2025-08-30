'use client'

import Header from '@/components/Header'
import { Heart, MapPin, Users, Target, Award, Globe } from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: "LocalVibe Team",
      role: "AI & Local Discovery Enthusiasts",
      description: "We're passionate about helping people discover the authentic, local experiences that make cities special."
    }
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Authenticity",
      description: "We believe in real, local experiences over tourist traps and generic chains."
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-500" />,
      title: "Local Discovery",
      description: "Every city has hidden gems waiting to be discovered by curious explorers."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Community",
      description: "We're building a community of local experts who share their discoveries."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Personalization",
      description: "Your mood and preferences should guide your adventures, not algorithms."
    }
  ]

  const stats = [
    { number: "8", label: "Curated Vibes" },
    { number: "∞", label: "Unique Trails" },
    { number: "100%", label: "Local Spots" },
    { number: "AI", label: "Powered" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gradient mb-6">
              About LocalVibe
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to transform how people discover local experiences, 
              one personalized trail at a time.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="card p-12 mb-16 text-center bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                LocalVibe exists to solve a simple but frustrating problem: 
                <strong className="text-gray-800"> decision fatigue when exploring new places</strong>.
              </p>
              <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                Instead of endless scrolling through generic recommendations, 
                we use AI to curate personalized walking trails that match your mood, 
                location, and preferences. The result? 
                <strong className="text-gray-800"> Authentic local experiences that feel like they were made just for you</strong>.
              </p>
            </div>
          </div>

          {/* The Problem We Solve */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              The Problem We're Solving
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-8 bg-red-50 border-red-200">
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  Before LocalVibe
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Endless scrolling through generic recommendations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Defaulting to familiar chains and tourist traps</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Missing the authentic local experiences</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Wasting time on research instead of exploring</span>
                  </li>
                </ul>
              </div>
              
              <div className="card p-8 bg-green-50 border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  With LocalVibe
                </h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>AI-curated trails in under 30 seconds</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Discovering hidden gems locals love</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Personalized experiences based on your mood</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>More time exploring, less time planning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              What We Believe In
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <div className="card p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Our Story
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-gray-600 leading-relaxed">
              <p>
                LocalVibe was born from a simple frustration: spending more time researching where to go 
                than actually exploring. We realized that while there are countless apps for finding places, 
                none of them truly understand the <strong className="text-gray-800">emotional and experiential</strong> side of local discovery.
              </p>
              
              <p>
                We started asking questions like: "What if an app could understand your mood and curate 
                experiences around it?" "What if it could find the hidden gems that locals love, not just 
                the places with the biggest marketing budgets?" "What if every trail felt like it was 
                created by a knowledgeable local friend who really gets you?"
              </p>
              
              <p>
                That's exactly what LocalVibe does. Using AI and machine learning, we analyze thousands 
                of data points to create trails that aren't just lists of places, but <strong className="text-gray-800">curated experiences 
                that tell a story</strong>. Every trail has a narrative, every stop is carefully chosen, 
                and every adventure feels personal.
              </p>
              
              <p>
                We're not just building an app – we're building a new way to experience cities. 
                A way that's more human, more authentic, and more fun. Because the best adventures 
                aren't the ones you plan for hours, they're the ones that feel like they were meant to happen.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Meet the Team
            </h2>
            
            <div className="max-w-2xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="card p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="card p-8 bg-gradient-to-r from-primary-50 to-purple-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of explorers who are discovering their cities in a whole new way.
              </p>
              <a href="/" className="btn-primary">
                Start Exploring Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
