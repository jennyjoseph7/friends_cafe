"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeft, ShoppingBag } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalItems, 
    totalPrice, 
    deliveryFee, 
    boxFees, 
    finalTotal,
    isFreeDelivery
  } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  const handleCheckout = () => {
    setIsCheckingOut(true)
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed.",
      })
      clearCart()
      setIsCheckingOut(false)
    }, 2000)
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Your Cart</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/#menu">
                <Button className="bg-red-600 hover:bg-red-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Menu
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Order Summary ({totalItems} items)</h2>
                  {!isFreeDelivery && (
                    <p className="text-sm text-gray-500 mt-1">
                      Add items worth ₹{(300 - totalPrice).toFixed(2)} more for free delivery
                    </p>
                  )}
                </div>
                
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 flex items-center">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-0 right-0">
                          <Badge className={item.isVeg ? "bg-green-600" : "bg-red-600"}>
                            {item.isVeg ? "Veg" : "Non-Veg"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex-1">
                        <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        )}
                        <p className="text-sm font-medium text-red-600">₹{item.price}</p>
                        {item.category && item.category.toLowerCase() === 'pizza' && (
                          <p className="text-xs text-blue-600">+₹10 box charge per item</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="ml-4 flex items-center">
                        <p className="text-base font-medium text-gray-800 mr-4">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    {isFreeDelivery ? (
                      <span className="font-medium text-green-600">Free</span>
                    ) : (
                      <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  {boxFees > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Pizza Box Charges</span>
                      <span className="font-medium">₹{boxFees.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-red-600">
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* No taxes applicable. Prices are inclusive of all taxes.</p>
                  {isFreeDelivery && (
                    <p className="text-xs text-green-600 mt-1">* Free delivery on orders above ₹300</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-between">
                <Link href="/#menu">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                
                <div className="space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full sm:w-auto mb-2 sm:mb-0"
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 