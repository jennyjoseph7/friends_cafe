"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { toast } from "./use-toast"
import { useAuth } from "./use-auth"
import { saveUserSessionItem, getUserSessionItem } from "@/lib/session-storage"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  isVeg: boolean
  category?: string // Added to identify pizza items
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  deliveryFee: number
  boxFees: number
  finalTotal: number
  isFreeDelivery: boolean
}

// Create a default context value
const defaultContext: CartContextType = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  deliveryFee: 30, // Default delivery fee for orders below 300
  boxFees: 0,
  finalTotal: 0,
  isFreeDelivery: false
}

// Create context
const CartContext = createContext<CartContextType>(defaultContext)

// Threshold for free delivery
const FREE_DELIVERY_THRESHOLD = 300

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Use null initial state with useState to handle SSR
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [boxFees, setBoxFees] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(30) // Default delivery fee
  const [isFreeDelivery, setIsFreeDelivery] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  
  // Calculate final total including delivery fee and box fees
  const finalTotal = totalPrice + deliveryFee + boxFees
  
  // Set mounted state on client side
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Reset cart state completely
  const resetCartState = useCallback(() => {
    setCart([])
    setTotalItems(0)
    setTotalPrice(0)
    setBoxFees(0)
    setDeliveryFee(30)
    setIsFreeDelivery(false)
  }, [])
  
  // Update delivery fee based on cart total
  useEffect(() => {
    if (totalPrice >= FREE_DELIVERY_THRESHOLD) {
      setDeliveryFee(0)
      setIsFreeDelivery(true)
    } else {
      setDeliveryFee(30)
      setIsFreeDelivery(false)
    }
  }, [totalPrice])
  
  // Load cart data when authentication state changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Reset cart state first to avoid mixing data
      resetCartState()
      
      if (isAuthenticated && user) {
        try {
          // If logged in, load user-specific cart data
          const sessionCart = getUserSessionItem<CartItem[]>(user.phone, 'cart')
          
          if (sessionCart && sessionCart.length > 0) {
            setCart(sessionCart)
          } else {
            // If no session data, check for legacy cart data
            const legacyCart = localStorage.getItem(`friendsCafe_cart_${user.id}`)
            if (legacyCart) {
              const parsedCart = JSON.parse(legacyCart)
              setCart(parsedCart)
              
              // Migrate to session storage
              saveUserSessionItem(user.phone, 'cart', parsedCart)
            }
          }
        } catch (error) {
          console.error('Failed to load user cart:', error)
        }
      } else {
        // For guest users, load guest cart
        try {
          const guestCart = localStorage.getItem('friendsCafe_cart_guest')
          if (guestCart) {
            setCart(JSON.parse(guestCart))
          }
        } catch (error) {
          console.error('Failed to load guest cart:', error)
        }
      }
    }
  }, [mounted, isAuthenticated, user, resetCartState])
  
  // Update cart totals whenever cart changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        // Calculate totals
        const itemsTotal = cart.reduce((sum, item) => sum + item.quantity, 0)
        const priceTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        
        setTotalItems(itemsTotal)
        setTotalPrice(priceTotal)
        
        // Calculate box fees (10 rupees per pizza item)
        setBoxFees(cart.reduce((sum, item) => {
          if (item.name.toLowerCase().includes('pizza') || (item.category && item.category.toLowerCase().includes('pizza'))) {
            return sum + (10 * item.quantity)
          }
          return sum
        }, 0))
        
        // If user is authenticated, save to session storage
        if (isAuthenticated && user) {
          saveUserSessionItem(user.phone, 'cart', cart)
          
          // Also update local storage with the same data
          // This helps with backward compatibility
          localStorage.setItem(`friendsCafe_cart_${user.id}`, JSON.stringify(cart))
        } else {
          // Save guest cart
          localStorage.setItem('friendsCafe_cart_guest', JSON.stringify(cart))
        }
      } catch (error) {
        console.error('Failed to save cart:', error)
      }
    }
  }, [cart, mounted, user, isAuthenticated])
  
  const addToCart = (newItem: CartItem) => {
    if (!mounted) return
    
    setCart(prevCart => {
      // Check if item already exists
      const existingItemIndex = prevCart.findIndex(item => item.id === newItem.id)
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += newItem.quantity
        
        toast({
          title: "Cart updated",
          description: `${newItem.name} quantity updated in your cart`,
        })
        
        return updatedCart
      } else {
        // Add new item
        toast({
          title: "Added to cart",
          description: `${newItem.name} added to your cart`,
        })
        
        return [...prevCart, newItem]
      }
    })
  }
  
  const removeFromCart = (id: string) => {
    if (!mounted) return
    
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === id)
      
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} removed from your cart`,
        })
      }
      
      return prevCart.filter(item => item.id !== id)
    })
  }
  
  const updateQuantity = (id: string, quantity: number) => {
    if (!mounted) return
    
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }
  
  const clearCart = () => {
    if (!mounted) return
    
    resetCartState()
    
    // Clear the appropriate storage based on auth state
    if (isAuthenticated && user) {
      saveUserSessionItem(user.phone, 'cart', [])
      localStorage.removeItem(`friendsCafe_cart_${user.id}`)
    } else {
      localStorage.removeItem('friendsCafe_cart_guest')
    }
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        deliveryFee,
        boxFees,
        finalTotal,
        isFreeDelivery
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  return useContext(CartContext)
} 