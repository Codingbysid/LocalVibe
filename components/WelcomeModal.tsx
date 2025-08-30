'use client'

import { useState, useEffect } from 'react'
import { Sparkles, MapPin, Heart } from 'lucide-react'

interface WelcomeModalProps {
  onClose: () => void
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const steps = [
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
      title: "Welcome to LocalVibe!",
      description: "Let's find your first adventure. Pick a vibe that calls to you.",
      action: "Get Started"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "AI-Curated Trails",
      description: "Our smart algorithm creates personalized walking routes just for you.",
      action: "Continue"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Discover Hidden Gems",
      description: "Find amazing local spots that match your mood perfectly.",
      action: "Let's Go!"
    }
  ]

  const currentStep = steps[step]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const handleSkip = () => {
    handleClose()
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-t-2xl h-1">
          <div 
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-1 rounded-t-2xl transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            {currentStep.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {currentStep.title}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= step ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 px-4 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 btn-primary"
            >
              {currentStep.action}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
