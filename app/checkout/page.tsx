"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, CreditCard, CornerDownLeft, ArrowLeft, Plus, Check, Home, Building, Edit, Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { saveUserSessionItem, getUserSessionItem } from "@/lib/session-storage"

// Address interface
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

// Payment methods
type PaymentMethod = 'cod' | 'paytm' | 'phonepe' | 'gpay' | 'card'

// User preferences interface
interface UserPreferences {
  preferredPaymentMethod?: PaymentMethod;
  [key: string]: any;
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { cart, totalItems, totalPrice, deliveryFee, boxFees, finalTotal, isFreeDelivery, clearCart } = useCart()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showAddAddressForm, setShowAddAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home'
  })
  
  // Update newAddress when user changes
  useEffect(() => {
    if (user) {
      setNewAddress(prev => ({
        ...prev,
        name: user.username,
        phone: user.phone
      }))
    }
  }, [user])
  
  // Redirect to cart if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/cart')
      return
    }
    
    if (cart.length === 0) {
      router.push('/cart')
      return
    }
  }, [isAuthenticated, cart, router])
  
  // Load saved addresses and checkout progress from session storage
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        // First try to get addresses from session storage
        const sessionAddresses = getUserSessionItem<Address[]>(user.phone, 'addresses');
        
        if (sessionAddresses && sessionAddresses.length > 0) {
          setAddresses(sessionAddresses);
          
          // Select the default address if available
          const defaultAddress = sessionAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (sessionAddresses.length > 0) {
            setSelectedAddressId(sessionAddresses[0].id);
          }
        } else {
          // Fallback to the legacy storage method
          const savedAddresses = localStorage.getItem(`friendsCafe_addresses_${user.id}`);
          if (savedAddresses) {
            const parsedAddresses = JSON.parse(savedAddresses) as Address[];
            setAddresses(parsedAddresses);
            
            // Migrate to the new session storage
            saveUserSessionItem(user.phone, 'addresses', parsedAddresses);
            
            // Select the default address if available
            const defaultAddress = parsedAddresses.find(addr => addr.isDefault);
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id);
            } else if (parsedAddresses.length > 0) {
              setSelectedAddressId(parsedAddresses[0].id);
            }
          }
        }
        
        // Restore checkout progress if available
        const lastCheckoutStep = getUserSessionItem<'address' | 'payment'>(user.phone, 'lastCheckoutStep');
        if (lastCheckoutStep) {
          setStep(lastCheckoutStep);
        }
        
        // Restore selected payment method if available
        const userPreferences = getUserSessionItem<UserPreferences>(user.phone, 'preferences');
        if (userPreferences && userPreferences.preferredPaymentMethod) {
          setPaymentMethod(userPreferences.preferredPaymentMethod);
        }
      } catch (error) {
        console.error('Failed to load addresses or checkout progress:', error);
      }
    } else {
      // Clear addresses if user logs out
      setAddresses([]);
      setSelectedAddressId('');
    }
  }, [user])
  
  // Save addresses to session storage and localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined' && user && addresses.length > 0) {
      try {
        // Save to new session storage system
        saveUserSessionItem(user.phone, 'addresses', addresses);
        
        // Also save to legacy storage for backward compatibility
        localStorage.setItem(`friendsCafe_addresses_${user.id}`, JSON.stringify(addresses));
      } catch (error) {
        console.error('Failed to save addresses:', error);
      }
    }
  }, [addresses, user])
  
  // Save checkout progress when step changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      saveUserSessionItem(user.phone, 'lastCheckoutStep', step);
    }
  }, [step, user]);
  
  // Save preferred payment method when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const currentPreferences = getUserSessionItem<UserPreferences>(user.phone, 'preferences') || {};
      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        preferredPaymentMethod: paymentMethod
      };
      saveUserSessionItem(user.phone, 'preferences', updatedPreferences);
    }
  }, [paymentMethod, user]);
  
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewAddress(prev => ({
      ...prev,
      [id]: value
    }))
  }
  
  const handleAddressTypeChange = (value: 'home' | 'work' | 'other') => {
    setNewAddress(prev => ({
      ...prev,
      type: value
    }))
  }
  
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }
    
    // Create new address
    const isFirstAddress = addresses.length === 0
    const newAddr: Address = {
      ...newAddress,
      id: `addr_${Date.now()}`,
      isDefault: isFirstAddress // Make it default if it's the first address
    }
    
    // Add to addresses
    const updatedAddresses = [...addresses, newAddr]
    setAddresses(updatedAddresses)
    
    // Select this address
    setSelectedAddressId(newAddr.id)
    
    // Reset form and hide it
    setNewAddress({
      name: user?.username || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home'
    })
    setShowAddAddressForm(false)
    
    toast({
      title: "Address added",
      description: "Your delivery address has been saved",
    })
  }
  
  const handleDeleteAddress = (id: string) => {
    const filteredAddresses = addresses.filter(addr => addr.id !== id)
    
    // If the deleted address was the selected one, select another one
    if (id === selectedAddressId && filteredAddresses.length > 0) {
      const defaultAddress = filteredAddresses.find(addr => addr.isDefault)
      setSelectedAddressId(defaultAddress ? defaultAddress.id : filteredAddresses[0].id)
    }
    
    // Update addresses
    setAddresses(filteredAddresses)
    
    toast({
      title: "Address removed",
      description: "Your delivery address has been deleted",
    })
  }
  
  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }))
    
    setAddresses(updatedAddresses)
    
    toast({
      title: "Default address updated",
      description: "Your default delivery address has been updated",
    })
  }
  
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setPaymentMethod(value)
  }
  
  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast({
        title: "No address selected",
        description: "Please select a delivery address to continue",
        variant: "destructive"
      })
      return
    }
    
    setStep('payment')
    window.scrollTo(0, 0)
  }
  
  const handlePlaceOrder = () => {
    // Check if we have a delivery address selected
    if (!selectedAddressId) {
      toast({
        title: "Please select a delivery address",
        variant: "destructive",
      })
      setStep("address")
      return
    }

    // Set processing state
    setIsProcessing(true)

    // Show payment processing message based on payment method
    if (paymentMethod === "card") {
      toast({
        title: "Processing payment...",
        description: "Please wait while we process your payment",
      })
    } else if (paymentMethod === "cod") {
      toast({
        title: "Placing order...",
        description: "Your order will be confirmed for cash on delivery",
      })
    }

    // Save order details to localStorage for the receipt page
    try {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId)
      
      const lastOrder = {
        items: cart,
        subtotal: totalPrice,
        deliveryFee: isFreeDelivery ? 0 : deliveryFee,
        boxFees: boxFees,
        total: finalTotal,
        paymentMethod,
        address: selectedAddress,
        orderDate: new Date().toISOString(),
        orderId: `ORD${Date.now().toString().slice(-8)}`,
      }
      
      localStorage.setItem('friendsCafe_lastOrder', JSON.stringify(lastOrder))
      
      // Also save to user's order history in session storage
      if (user) {
        const orderHistory = getUserSessionItem<any[]>(user.phone, 'recentOrders') || [];
        saveUserSessionItem(user.phone, 'recentOrders', [lastOrder, ...orderHistory]);
        
        // Clear checkout progress after successful order
        saveUserSessionItem(user.phone, 'lastCheckoutStep', undefined);
      }
      
      // Simulate order processing delay
      setTimeout(() => {
        // Clear cart first to ensure it's done
        clearCart()
        setIsProcessing(false)
        
        // Show a success message before redirecting
        toast({
          title: "Order placed successfully!",
          description: "Redirecting to order confirmation...",
        })
        
        try {
          // Short delay before redirect to ensure toast is visible
          setTimeout(() => {
            try {
              // Use direct window location change instead of router for more reliable redirect
              const redirectUrl = `/order-success?method=${paymentMethod}`
              window.location.href = redirectUrl
            } catch (redirectError) {
              console.error('Failed to redirect:', redirectError)
              // If redirect fails, at least show a success message
              toast({
                title: "Order completed successfully!",
                description: "Your order has been placed and will be delivered soon.",
              })
            }
          }, 1000)
        } catch (timingError) {
          console.error('Redirect timing error:', timingError)
          // Fallback if setTimeout fails
          window.location.href = `/order-success?method=${paymentMethod}`
        }
      }, 2000)
    } catch (error) {
      console.error('Failed to save order details:', error)
      setIsProcessing(false)
      
      toast({
        title: "Order failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  const getPaymentMethodText = () => {
    const methods = {
      cod: "Cash on Delivery",
      paytm: "Paytm",
      phonepe: "PhonePe",
      gpay: "Google Pay",
      card: "Credit/Debit Card"
    }
    return methods[paymentMethod]
  }
  
  const renderAddressForm = () => (
    <form onSubmit={handleAddAddress} className="mt-4 border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Add New Address</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input 
            id="name" 
            value={newAddress.name}
            onChange={handleAddressInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone" 
            type="tel"
            value={newAddress.phone}
            onChange={handleAddressInputChange}
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Textarea 
          id="addressLine1" 
          value={newAddress.addressLine1}
          onChange={handleAddressInputChange}
          placeholder="House/Flat No, Building Name, Street"
          required
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Textarea 
          id="addressLine2" 
          value={newAddress.addressLine2}
          onChange={handleAddressInputChange}
          placeholder="Landmark, Area"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input 
            id="city" 
            value={newAddress.city}
            onChange={handleAddressInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input 
            id="state" 
            value={newAddress.state}
            onChange={handleAddressInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode *</Label>
          <Input 
            id="pincode" 
            value={newAddress.pincode}
            onChange={handleAddressInputChange}
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <Label>Address Type *</Label>
        <RadioGroup 
          value={newAddress.type} 
          onValueChange={handleAddressTypeChange as (value: string) => void}
          className="flex space-x-4 mt-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="home" id="address-home" />
            <Label htmlFor="address-home" className="cursor-pointer">Home</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="work" id="address-work" />
            <Label htmlFor="address-work" className="cursor-pointer">Work</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="address-other" />
            <Label htmlFor="address-other" className="cursor-pointer">Other</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setShowAddAddressForm(false)}
        >
          Cancel
        </Button>
        <Button type="submit">Save Address</Button>
      </div>
    </form>
  )
  
  const renderAddressSelection = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Delivery Address
        </CardTitle>
        <CardDescription>Select where you want your order delivered</CardDescription>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 && !showAddAddressForm ? (
          <div className="text-center p-6">
            <p className="text-gray-500 mb-4">You don't have any saved addresses</p>
            <Button 
              onClick={() => setShowAddAddressForm(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup 
              value={selectedAddressId} 
              onValueChange={setSelectedAddressId}
              className="space-y-4"
            >
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`border rounded-lg p-4 relative ${
                    address.id === selectedAddressId ? 'border-red-600 bg-red-50' : ''
                  }`}
                >
                  {address.isDefault && (
                    <Badge className="absolute top-2 right-2 bg-green-600">Default</Badge>
                  )}
                  <div className="flex items-start">
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="ml-2 flex-1">
                      <div className="flex items-center mb-1">
                        <Label htmlFor={address.id} className="font-medium cursor-pointer">
                          {address.name}
                        </Label>
                        <Badge 
                          className="ml-2 text-xs"
                          variant={address.type === 'home' ? 'default' : address.type === 'work' ? 'secondary' : 'outline'}
                        >
                          {address.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                      <p className="text-sm text-gray-600">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                      </p>
                      <div className="flex mt-3 gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                        {!address.isDefault && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
            
            {!showAddAddressForm && (
              <Button 
                onClick={() => setShowAddAddressForm(true)}
                variant="outline"
                className="w-full mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Address
              </Button>
            )}
            
            {showAddAddressForm && renderAddressForm()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button 
          variant="outline"
          onClick={() => router.push('/cart')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={handleProceedToPayment}
          disabled={!selectedAddressId || addresses.length === 0}
        >
          Continue to Payment
        </Button>
      </CardFooter>
    </Card>
  )
  
  const renderPaymentOptions = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>Select how you want to pay for your order</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={handlePaymentMethodChange as (value: string) => void}
          className="space-y-4"
        >
          <div className={`border rounded-lg p-4 ${paymentMethod === 'cod' ? 'border-red-600 bg-red-50' : ''}`}>
            <div className="flex items-start">
              <RadioGroupItem value="cod" id="payment-cod" className="mt-1" />
              <div className="ml-2">
                <Label htmlFor="payment-cod" className="font-medium cursor-pointer">Cash on Delivery</Label>
                <p className="text-sm text-gray-600">Pay with cash when your order arrives</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Online Payment</h3>
            <div className="space-y-3 pl-2">
              <div className={`border rounded-lg p-3 ${paymentMethod === 'paytm' ? 'border-red-600 bg-red-50' : ''}`}>
                <div className="flex items-center">
                  <RadioGroupItem value="paytm" id="payment-paytm" />
                  <Label htmlFor="payment-paytm" className="ml-2 cursor-pointer">Paytm UPI</Label>
                </div>
              </div>
              
              <div className={`border rounded-lg p-3 ${paymentMethod === 'phonepe' ? 'border-red-600 bg-red-50' : ''}`}>
                <div className="flex items-center">
                  <RadioGroupItem value="phonepe" id="payment-phonepe" />
                  <Label htmlFor="payment-phonepe" className="ml-2 cursor-pointer">PhonePe</Label>
                </div>
              </div>
              
              <div className={`border rounded-lg p-3 ${paymentMethod === 'gpay' ? 'border-red-600 bg-red-50' : ''}`}>
                <div className="flex items-center">
                  <RadioGroupItem value="gpay" id="payment-gpay" />
                  <Label htmlFor="payment-gpay" className="ml-2 cursor-pointer">Google Pay</Label>
                </div>
              </div>
              
              <div className={`border rounded-lg p-3 ${paymentMethod === 'card' ? 'border-red-600 bg-red-50' : ''}`}>
                <div className="flex items-center">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card" className="ml-2 cursor-pointer">Credit / Debit Card</Label>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button 
          variant="outline"
          onClick={() => setStep('address')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Addresses
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
        </Button>
      </CardFooter>
    </Card>
  )
  
  const renderOrderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Items ({totalItems})</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            {isFreeDelivery ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>₹{deliveryFee.toFixed(2)}</span>
            )}
          </div>
          {boxFees > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Packaging Charges</span>
              <span>₹{boxFees.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-red-600">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  // Return early if not authenticated or cart empty
  if (!isAuthenticated || cart.length === 0) {
    return null
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 mb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              {step === 'address' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-red-600" />
                      Delivery Address
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                      className="text-sm"
                    >
                      {showAddAddressForm ? 'Cancel' : (
                        <>
                          <Plus className="h-4 w-4 mr-1" /> 
                          Add New Address
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {showAddAddressForm ? renderAddressForm() : renderAddressSelection()}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-red-600" />
                      Payment Method
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStep('address')}
                      className="text-sm"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" /> 
                      Back to Address
                    </Button>
                  </div>
                  
                  {renderPaymentOptions()}
                </div>
              )}
            </div>
            
            <div className="md:col-span-4">
              {renderOrderSummary()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 