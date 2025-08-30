'use client'

import { useState, useEffect } from 'react'
import { MapPin, Menu, X, User, Heart } from 'lucide-react'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'
import { getCurrentUser, signOut } from '@/lib/supabase'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing user session on component mount
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user: currentUser } = await getCurrentUser()
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          name: currentUser.email?.split('@')[0] || 'User',
          avatar: currentUser.user_metadata?.avatar_url || null
        })
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = (userData: User) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const openAuthModal = () => {
    setShowAuthModal(true)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">LocalVibe</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/how-it-works" 
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              How it Works
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>
            {user && (
              <Link 
                href="/saved-trails" 
                className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
              >
                <Heart className="w-4 h-4" />
                <span>Saved Trails</span>
              </Link>
            )}
            {user ? (
              <UserProfile user={user} onLogout={handleLogout} />
            ) : (
              <button onClick={openAuthModal} className="btn-primary">
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {user && (
                <Link 
                  href="/saved-trails" 
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  <span>Saved Trails</span>
                </Link>
              )}
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={openAuthModal} className="btn-primary w-full">
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  )
}
