"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Home, ShoppingBag, Truck, Clock, CreditCard, MapPin, Calendar, ChevronRight, ChevronDown, ChevronsUp } from "lucide-react"
import Image from "next/image"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const paymentMethod = searchParams.get('method') || 'cod'
  const [orderNumber, setOrderNumber] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  
  // Generate a random order number and set estimated delivery on page load
  useEffect(() => {
    // Generate random order ID
    const randomOrderId = `FC${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(randomOrderId)
    
    // Set current date
    const now = new Date()
    setOrderDate(now.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }))
    
    // Set delivery time (30-45 mins from now)
    const deliveryStart = new Date(now.getTime() + 30 * 60000)
    const deliveryEnd = new Date(now.getTime() + 45 * 60000)
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
    
    setDeliveryTime(`${formatTime(deliveryStart)} - ${formatTime(deliveryEnd)}`)
  }, [])
  
  const getPaymentMethodText = () => {
    switch(paymentMethod) {
      case 'cod': return 'Cash on Delivery'
      case 'paytm': return 'Paytm UPI'
      case 'phonepe': return 'PhonePe'
      case 'gpay': return 'Google Pay'
      case 'card': return 'Credit/Debit Card'
      default: return 'Online Payment'
    }
  }
  
  const getPaymentMethodIcon = () => {
    switch(paymentMethod) {
      case 'cod': return '/images/payment/cod.svg'
      case 'paytm': return '/images/payment/paytm.svg'
      case 'phonepe': return '/images/payment/phonepe.svg'
      case 'gpay': return '/images/payment/gpay.svg'
      case 'card': return '/images/payment/card.svg'
      default: return '/images/payment/default.svg'
    }
  }
  
  const isOnlinePayment = paymentMethod !== 'cod'
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Top card with order status */}
          <Card className={`border-0 shadow-lg overflow-hidden mb-6 ${isOnlinePayment ? 'bg-blue-50' : 'bg-green-50'}`}>
            <div className="p-6 md:p-8 flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isOnlinePayment ? 'bg-blue-100' : 'bg-green-100'}`}>
                <CheckCircle className={`h-10 w-10 ${isOnlinePayment ? 'text-blue-600' : 'text-green-600'}`} />
              </div>
              
              <CardTitle className="text-2xl md:text-3xl text-center mb-2">
                {isOnlinePayment ? 'Payment Successful!' : 'Order Confirmed!'}
              </CardTitle>
              
              <CardDescription className="text-center text-base mb-4">
                {isOnlinePayment 
                  ? 'Your payment has been processed successfully and your order is confirmed.' 
                  : 'Your order has been placed successfully and will be delivered soon.'}
              </CardDescription>
              
              <Badge className={`text-sm py-1.5 px-3 ${isOnlinePayment ? 'bg-blue-600' : 'bg-green-600'}`}>
                Order #{orderNumber}
              </Badge>
            </div>
          </Card>
          
          {/* Delivery Status Card */}
          <Card className="mb-6 border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 pb-4">
              <CardTitle className="text-xl">Delivery Status</CardTitle>
              <CardDescription>
                Your order is being prepared and will be delivered soon
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="flex mb-8 relative">
                  <div className="min-w-8 h-8 rounded-full bg-green-100 border-4 border-white flex items-center justify-center z-10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-gray-500">{orderDate}</p>
                  </div>
                </div>
                
                <div className="flex mb-8 relative">
                  <div className="min-w-8 h-8 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center z-10">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-medium">Preparing Your Food</h3>
                    <p className="text-sm text-gray-500">Your delicious food is being prepared</p>
                  </div>
                </div>
                
                <div className="flex mb-8 relative">
                  <div className="min-w-8 h-8 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center z-10">
                    <Truck className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-medium text-gray-400">Out for Delivery</h3>
                    <p className="text-sm text-gray-500">Expected: {deliveryTime}</p>
                  </div>
                </div>
                
                <div className="flex relative">
                  <div className="min-w-8 h-8 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center z-10">
                    <Home className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-medium text-gray-400">Delivered</h3>
                    <p className="text-sm text-gray-500">Enjoy your meal!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Details Card */}
          <Card className="border-0 shadow-md overflow-hidden mb-6">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 pb-4">
              <div>
                <CardTitle className="text-xl">Order Details</CardTitle>
                <CardDescription>
                  Overview of your order
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full" 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <ChevronsUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            
            <CardContent className={`p-0 ${showDetails ? 'block' : 'hidden'}`}>
              <div className="p-6 border-b">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-medium">Delivery Address</h3>
                </div>
                <p className="text-sm text-gray-600 ml-7">
                  123 Example Street, Apartment 4B<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
              
              <div className="p-6 border-b">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-medium">Payment Method</h3>
                </div>
                <div className="flex items-center ml-7">
                  <div className="w-10 h-10 relative mr-3">
                    <Image
                      src={getPaymentMethodIcon()}
                      alt={getPaymentMethodText()}
                      width={40}
                      height={40}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/payment/default.svg";
                      }}
                    />
                  </div>
                  <span className="text-sm">{getPaymentMethodText()}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-medium">Order Summary</h3>
                </div>
                <div className="ml-7 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹450.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Packaging</span>
                    <span>₹30.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-red-600">₹480.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/account?tab=orders" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full shadow-sm"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Track My Orders
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-700 shadow-sm">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          {/* Receipt Link */}
          <div className="mt-6 text-center">
            <Link href="#" className="text-sm text-blue-600 hover:underline inline-flex items-center">
              Download Receipt
              <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 