"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "./use-toast"
import { 
  getUserSession, 
  saveUserSession, 
  clearUserSessionData, 
  hasUserSession 
} from "@/lib/session-storage"

export interface User {
  id: string
  username: string
  phone: string
  isLoggedIn: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (phone: string, otp: string) => Promise<boolean>
  logout: () => void
  signup: (username: string, phone: string, otp: string) => Promise<boolean>
}

const defaultContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  signup: async () => false
}

const AuthContext = createContext<AuthContextType>(defaultContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Clear any potentially corrupted data on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check if there's a user in localStorage
        const savedUser = localStorage.getItem('friendsCafeUser')
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            if (!parsedUser || !parsedUser.phone || !parsedUser.id || !parsedUser.isLoggedIn) {
              // Remove invalid user data
              localStorage.removeItem('friendsCafeUser')
            }
          } catch {
            // If we can't parse the JSON, clear it
            localStorage.removeItem('friendsCafeUser')
          }
        }
      } catch (error) {
        console.error('Error cleaning up localStorage:', error)
      }
    }
  }, [])
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Load user data from localStorage on initial mount
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      setIsLoading(true)
      try {
        const savedUser = localStorage.getItem('friendsCafeUser')
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            
            // Only set the user if they have a phone number and ID
            // This prevents auto-login for incomplete user data
            if (parsedUser && parsedUser.phone && parsedUser.id && parsedUser.isLoggedIn) {
              // Verify that this user has an actual session
              const hasSession = hasUserSession(parsedUser.phone)
              if (hasSession) {
                setUser(parsedUser)
              } else {
                // If no session exists, this may be invalid user data
                localStorage.removeItem('friendsCafeUser')
              }
            } else {
              // Invalid user data, remove it
              localStorage.removeItem('friendsCafeUser')
            }
          } catch (parseError) {
            // If we can't parse the user data, remove it
            console.error('Invalid user data in localStorage:', parseError)
            localStorage.removeItem('friendsCafeUser')
          }
        }
      } catch (error) {
        console.error('Failed to load user from localStorage:', error)
      }
      setIsLoading(false)
    }
  }, [mounted])
  
  // Demo login function (simulates an API call)
  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Prevent multiple concurrent verification attempts
    if (isLoading) {
      toast({
        title: "Please wait",
        description: "Verification in progress..."
      })
      return false
    }
    
    setIsLoading(true)
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, "1234" is the valid OTP
        if (otp === "1234") {
          // Check if this phone number has been used before
          const hasExistingSession = hasUserSession(phone)
          
          // If no existing session, this is a non-registered user
          if (!hasExistingSession) {
            toast({
              title: "Account not found",
              description: "This phone number is not registered. Please sign up first.",
              variant: "destructive"
            })
            setIsLoading(false)
            resolve(false)
            return
          }
          
          // Generate a user ID from the phone to ensure consistency across logins
          const phoneId = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
          const userId = `user_${phoneId}`
          
          let username = `User-${phone.substring(phone.length - 4)}`
          
          // For returning users, get their existing username if available
          if (hasExistingSession) {
            const session = getUserSession(phone)
            if (session && session.preferences && session.preferences.username) {
              username = session.preferences.username
            }
          }
          
          const newUser: User = {
            id: userId,
            username: username,
            phone,
            isLoggedIn: true
          }
          
          // Clear previous user data from client side first
          localStorage.removeItem('friendsCafe_cart_guest')
          
          // Save user to state and localStorage
          setUser(newUser)
          localStorage.setItem('friendsCafeUser', JSON.stringify(newUser))
          
          // Update the last login timestamp
          const session = getUserSession(phone) || { cart: [], addresses: [], recentOrders: [], preferences: {} }
          session.preferences = {
            ...session.preferences,
            lastLoginDate: new Date().toISOString()
          }
          saveUserSession(phone, { preferences: session.preferences })
          
          toast({
            title: "Login successful",
            description: "Welcome to Friends' Cafe",
          })
          
          setIsLoading(false)
          resolve(true)
        } else {
          toast({
            title: "Login failed",
            description: "Invalid OTP. Please try again.",
            variant: "destructive"
          })
          setIsLoading(false)
          resolve(false)
        }
      }, 1500)
    })
  }
  
  // Demo signup function (simulates an API call)
  const signup = async (username: string, phone: string, otp: string): Promise<boolean> => {
    // Prevent multiple concurrent verification attempts
    if (isLoading) {
      toast({
        title: "Please wait",
        description: "Verification in progress..."
      })
      return false
    }
    
    // Validate phone number format
    const normalizedPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
    if (normalizedPhone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with at least 10 digits",
        variant: "destructive"
      })
      return false
    }
    
    // Check if user already exists before proceeding
    const hasExistingSession = hasUserSession(normalizedPhone)
    if (hasExistingSession) {
      toast({
        title: "Account already exists",
        description: "This phone number is already registered. Please login instead.",
        variant: "destructive"
      })
      return false
    }
    
    // Validate username
    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      toast({
        title: "Invalid username",
        description: "Please enter a valid username",
        variant: "destructive"
      })
      return false
    }
    
    setIsLoading(true)
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, "1234" is the valid OTP
        if (otp === "1234") {
          // Check if this phone number has been used before (we'll still allow signup, 
          // but we'll restore any existing session data)
          const hasExistingSession = hasUserSession(phone)
          
          // Generate a user ID from the phone to ensure consistency across logins
          const phoneId = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
          const userId = `user_${phoneId}`
          
          const newUser: User = {
            id: userId,
            username,
            phone,
            isLoggedIn: true
          }
          
          // Clear previous user data from client side first
          localStorage.removeItem('friendsCafe_cart_guest')
          
          // Update user
          setUser(newUser)
          localStorage.setItem('friendsCafeUser', JSON.stringify(newUser))
          
          // Make sure to always create a session, even if empty
          // This is critical to ensure the user is properly registered
          const session = getUserSession(phone) || { cart: [], addresses: [], recentOrders: [], preferences: {} }
          session.preferences = {
            ...session.preferences,
            username: username,
            registeredDate: new Date().toISOString()
          }
          
          // Always save the session so there's evidence this user exists
          saveUserSession(phone, session)
          
          // If new user, save guest cart to their session
          if (!hasExistingSession) {
            // Save guest cart before signup
            const guestCartJson = localStorage.getItem('friendsCafe_cart_guest')
            if (guestCartJson) {
              try {
                const guestCart = JSON.parse(guestCartJson)
                if (guestCart && guestCart.length > 0) {
                  saveUserSession(phone, { cart: guestCart })
                }
              } catch (error) {
                console.error('Failed to transfer guest cart:', error)
              }
            }
          }
          
          toast({
            title: "Account created!",
            description: "Your account has been successfully created",
          })
          
          setIsLoading(false)
          resolve(true)
        } else {
          toast({
            title: "Signup failed",
            description: "Invalid OTP. Please try again.",
            variant: "destructive"
          })
          setIsLoading(false)
          resolve(false)
        }
      }, 1500)
    })
  }
  
  const logout = () => {
    // Save the phone before clearing it for future reference
    const userPhone = user?.phone
    
    // Clear user session from local state
    setUser(null)
    localStorage.removeItem('friendsCafeUser')
    
    // Clear the user-specific cart from localStorage to prevent data leakage
    if (user) {
      localStorage.removeItem(`friendsCafe_cart_${user.id}`)
    }
    
    // Ensure guest cart is reset when logging out
    localStorage.removeItem('friendsCafe_cart_guest')
    
    // Clear any other potential user data
    localStorage.removeItem('friendsCafe_addresses')
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    
    router.push('/')
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}