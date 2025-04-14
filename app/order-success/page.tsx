"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
  isVeg: boolean
  image?: string
  size?: string
}

interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  type: 'home' | 'work' | 'other'
  isDefault: boolean
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams.get('method') || 'cod'
  const [orderNumber, setOrderNumber] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [boxFees, setBoxFees] = useState(0)
  const [total, setTotal] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null)
  const { user } = useAuth()
  
  // Generate a random order number and delivery time on page load and retrieve order details
  useEffect(() => {
    // Generate random order ID
    const randomOrderId = `FC${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(randomOrderId)
    
    // Set delivery time (30-45 mins from now)
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 35 * 60000); // 35 minutes from now
    setDeliveryTime(deliveryTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }));
    
    // Try to get last order from localStorage
    try {
      const lastOrderJson = localStorage.getItem('friendsCafe_lastOrder')
      if (lastOrderJson) {
        const lastOrder = JSON.parse(lastOrderJson)
        setOrderItems(lastOrder.items || [])
        
        // Get address
        if (lastOrder.address) {
          setDeliveryAddress(lastOrder.address)
        }
        
        // Calculate totals
        const itemsSubtotal = lastOrder.items.reduce((sum: number, item: CartItem) => 
          sum + (item.price * item.quantity), 0);
        setSubtotal(itemsSubtotal)
        
        // Calculate box fees - ₹10 per pizza item
        const pizzaBoxFees = lastOrder.items.reduce((sum: number, item: CartItem) => 
          sum + (item.category?.toLowerCase() === 'pizza' ? 10 * item.quantity : 0), 0);
        setBoxFees(pizzaBoxFees)
        
        // Delivery fee logic - Free over ₹300, otherwise ₹30
        const calcDeliveryFee = itemsSubtotal >= 300 ? 0 : 30;
        setDeliveryFee(calcDeliveryFee)
        
        // Calculate total
        setTotal(itemsSubtotal + pizzaBoxFees + calcDeliveryFee)
      } else {
        // If no last order found, use some sample data
        const sampleItems = [
          { id: '1', name: "Paneer Pizza", price: 199, quantity: 1, category: "pizza", isVeg: true },
          { id: '2', name: "French Fries", price: 99, quantity: 1, category: "sides", isVeg: true }
        ]
        setOrderItems(sampleItems)
        
        const sampleSubtotal = sampleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        setSubtotal(sampleSubtotal)
        
        const sampleBoxFees = sampleItems.reduce((sum, item) => 
          sum + (item.category?.toLowerCase() === 'pizza' ? 10 * item.quantity : 0), 0)
        setBoxFees(sampleBoxFees)
        
        const sampleDeliveryFee = sampleSubtotal >= 300 ? 0 : 30
        setDeliveryFee(sampleDeliveryFee)
        
        setTotal(sampleSubtotal + sampleBoxFees + sampleDeliveryFee)
      }
    } catch (error) {
      console.error('Error loading last order:', error)
    }
  }, [])
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded overflow-hidden">
            {/* Header section with teal color */}
            <div className="bg-teal-500 text-white p-6 pb-10 text-center relative">
              <div className="absolute top-0 left-0 right-0">
                <svg viewBox="0 0 400 10" preserveAspectRatio="none" className="w-full h-2">
                  <path d="M0,0 L8,5 L16,0 L24,5 L32,0 L40,5 L48,0 L56,5 L64,0 L72,5 L80,0 L88,5 L96,0 L104,5 L112,0 L120,5 L128,0 L136,5 L144,0 L152,5 L160,0 L168,5 L176,0 L184,5 L192,0 L200,5 L208,0 L216,5 L224,0 L232,5 L240,0 L248,5 L256,0 L264,5 L272,0 L280,5 L288,0 L296,5 L304,0 L312,5 L320,0 L328,5 L336,0 L344,5 L352,0 L360,5 L368,0 L376,5 L384,0 L392,5 L400,0" fill="white" />
                </svg>
              </div>
              <h2 className="text-xl font-bold uppercase mb-2">FRIENDS CAFE</h2>
              <p className="text-sm">
                {user ? user.username : (deliveryAddress?.name || "{name}")}, thanks for ordering!<br />
                Here's your receipt for {deliveryAddress?.phone || user?.phone || "{customer_address}"}
              </p>
            </div>
            
            {/* Food image */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24 bg-white rounded-full -mt-12 border-4 border-white shadow-md overflow-hidden">
                <Image 
                  src="/images/logo.svg" 
                  alt="Food" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Delivery time */}
            <div className="text-center py-4">
              <p className="text-gray-700">Your food is coming at <span className="font-semibold">{deliveryTime}</span></p>
            </div>
            
            {/* Order summary header */}
            <div className="bg-green-500 text-white text-center py-2 font-semibold">
              ORDER SUMMARY
            </div>
            
            {/* Order items */}
            <div className="px-6 py-4">
              {orderItems.map((item, index) => (
                <div key={item.id} className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {item.category === 'pizza' && 'Box charge ₹10 per item'}
                      {item.size && ` • Size: ${item.size}`}
                    </p>
                  </div>
                  <div className="flex items-start space-x-12">
                    <span className="text-center w-4">{item.quantity}</span>
                    <span className="font-medium text-right w-12">₹{item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              {/* Order totals */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                {boxFees > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Pizza Box Charges</span>
                    <span>₹{boxFees.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Delivery Address */}
              {deliveryAddress && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="font-medium">Delivery Address</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-5">
                    <p className="mb-1">{deliveryAddress.name} • {deliveryAddress.phone}</p>
                    <p>
                      {deliveryAddress.addressLine1}
                      {deliveryAddress.addressLine2 && `, ${deliveryAddress.addressLine2}`},
                      <br />
                      {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.pincode}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Payment method */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Method</span>
                  {paymentMethod === 'card' ? (
                    <div className="bg-gray-100 px-3 py-1 rounded border border-gray-300 flex items-center">
                      <span className="text-xs font-medium mr-1">CARD</span>
                      <div className="w-8 h-5 bg-blue-700 text-white rounded text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 px-3 py-1 rounded border border-gray-300">
                      <span className="text-xs font-medium">Cash on Delivery</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Back to home button */}
              <div className="mt-8">
                <div className="bg-red-600 hover:bg-red-700 p-4 text-center rounded-lg cursor-pointer">
                  <Link href="/" className="block w-full text-white font-medium">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 