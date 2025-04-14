"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getUserSessionItem } from "@/lib/session-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Clock, ChevronRight, MapPin, Home, Building, Briefcase } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  isVeg: boolean
  category?: string
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

interface Order {
  orderId: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  boxFees: number
  total: number
  paymentMethod: string
  address: Address
  orderDate: string
}

export default function OrderHistoryPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  
  // Load order history from session storage
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?redirect=/account/orders')
      return
    }
    
    if (user) {
      setIsLoading(true)
      const orderHistory = getUserSessionItem<Order[]>(user.phone, 'recentOrders') || []
      setOrders(orderHistory)
      setIsLoading(false)
    }
  }, [user, isAuthenticated, router])
  
  // Handles adding all items from an order to the cart
  const handleReorder = (order: Order) => {
    setReorderingId(order.orderId)
    
    // Clear timeout if component is unmounted during reordering
    const timeoutId = setTimeout(() => {
      // Add all items from the order to the cart
      order.items.forEach(item => {
        addToCart(item)
      })
      
      // Show success message
      toast({
        title: "Items added to cart",
        description: `${order.items.length} items from order #${order.orderId} have been added to your cart`,
      })
      
      // Navigate to cart page
      router.push('/cart')
      
      setReorderingId(null)
    }, 1000)
    
    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timeoutId)
  }
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }
  
  const getAddressTypeIcon = (type: 'home' | 'work' | 'other') => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4 mr-1" />
      case 'work': return <Briefcase className="h-4 w-4 mr-1" />
      default: return <MapPin className="h-4 w-4 mr-1" />
    }
  }
  
  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      cod: "Cash on Delivery",
      paytm: "Paytm",
      phonepe: "PhonePe",
      gpay: "Google Pay",
      card: "Credit/Debit Card"
    }
    return methods[method] || method
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Your Orders</h1>
            <Link href="/account">
              <Button variant="outline" size="sm">Back to Account</Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="py-8 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-medium mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-4">
                  You haven't placed any orders yet.
                </p>
                <Link href="/">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(order.orderDate)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{order.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">
                          {getPaymentMethodText(order.paymentMethod)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="w-12 h-12 mr-3 relative rounded-md overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-500 italic pt-1">
                          + {order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="text-sm">
                      <div className="font-medium mb-1 flex items-center">
                        {getAddressTypeIcon(order.address.type)}
                        Delivered to {order.address.type.charAt(0).toUpperCase() + order.address.type.slice(1)}
                      </div>
                      <div className="text-gray-600">
                        {order.address.name}, {order.address.phone}
                        <br />
                        {order.address.addressLine1}, 
                        {order.address.addressLine2 ? ` ${order.address.addressLine2},` : ''} 
                        <br />
                        {order.address.city}, {order.address.state} - {order.address.pincode}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 justify-between border-t">
                    <div>
                      <div className="text-sm font-medium">Order Summary</div>
                      <div className="text-xs text-gray-500">
                        Subtotal: ₹{order.subtotal.toFixed(2)} | 
                        Delivery: ₹{order.deliveryFee.toFixed(2)} | 
                        Box Fees: ₹{order.boxFees.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center text-sm font-medium"
                      onClick={() => handleReorder(order)}
                      disabled={reorderingId === order.orderId}
                    >
                      {reorderingId === order.orderId ? 'Adding to cart...' : 'Reorder'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 