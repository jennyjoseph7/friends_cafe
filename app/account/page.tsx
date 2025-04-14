"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, MapPin, ShoppingBag, Clock, CreditCard, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "../../hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getUserSessionItem, saveUserSessionItem, getUserSession, saveUserSession } from "@/lib/session-storage"
import { useCart } from "@/hooks/use-cart"

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    fullName: '',
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?redirect=/account')
    }
  }, [isAuthenticated, router])
  
  // Load user data from session storage
  useEffect(() => {
    if (user) {
      // Set initial profile data from user object
      setProfileData({
        fullName: user.username,
      })
      
      // Load recent orders
      const orderHistory = getUserSessionItem<any[]>(user.phone, 'recentOrders') || [];
      setRecentOrders(orderHistory.slice(0, 3)); // Show only the most recent 3 orders
      
      // Load saved addresses
      const savedAddresses = getUserSessionItem<any[]>(user.phone, 'addresses') || [];
      setAddresses(savedAddresses);
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return;
    
    setIsLoading(true)
    
    // Get the updated name from the form
    const updatedName = profileData.fullName.trim();
    
    if (!updatedName) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Update user object in local storage
        const updatedUser = {
          ...user,
          username: updatedName
        };
        localStorage.setItem('friendsCafeUser', JSON.stringify(updatedUser));
        
        // Update username in session preferences
        const session = getUserSession(user.phone) || { cart: [], addresses: [], recentOrders: [], preferences: {} };
        session.preferences = {
          ...session.preferences,
          username: updatedName
        };
        saveUserSession(user.phone, { preferences: session.preferences });
        
        // Force a refresh to update the UI
        window.location.reload();
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully",
        });
      } catch (error) {
        toast({
          title: "Update failed",
          description: "There was an error updating your profile",
          variant: "destructive"
        });
        console.error("Profile update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }
  
  // Handle reordering items from a past order
  const handleReorder = (order: any) => {
    setReorderingId(order.orderId)
    
    setTimeout(() => {
      // Add all items from the order to the cart
      order.items.forEach((item: any) => {
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
  }
  
  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Loading account information...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.username} />
              <AvatarFallback>{user.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-red-600">{user.username}</h1>
              <p className="text-gray-600">{user.phone}</p>
              {addresses.length > 0 && addresses.find(addr => addr.isDefault) && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {addresses.find(addr => addr.isDefault)?.addressLine1}, 
                    {addresses.find(addr => addr.isDefault)?.city}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={profileData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          type="tel" 
                          defaultValue={user.phone}
                          required
                          disabled
                        />
                        <p className="text-xs text-gray-500">
                          Your phone number cannot be changed as it's used for authentication
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end items-center gap-4">
                      <Button 
                        type="submit" 
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                  
                  <Separator className="my-8" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-red-600 mb-4">Account Management</h3>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their details</CardDescription>
                  </div>
                  <Link href="/account/orders">
                    <Button variant="outline" size="sm">View All Orders</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium">No Orders Yet</h3>
                      <p className="text-gray-500 mt-2 mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Link href="/">
                        <Button className="bg-red-600 hover:bg-red-700">
                          Browse Menu
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {recentOrders.map((order) => (
                        <div key={order.orderId} className="border rounded-lg p-4">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h3 className="font-medium">Order #{order.orderId}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex-1 md:text-right">
                              <p className="font-medium">₹{order.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReorder(order)}
                                disabled={reorderingId === order.orderId}
                              >
                                {reorderingId === order.orderId ? 'Adding...' : 'Reorder'}
                              </Button>
                              <Link href="/account/orders">
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Link href="/checkout">
                    <Button variant="outline" size="sm">Add New Address</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium">No Addresses Saved</h3>
                      <p className="text-gray-500 mt-2 mb-4">
                        You haven't saved any delivery addresses yet.
                      </p>
                      <Link href="/checkout">
                        <Button className="bg-red-600 hover:bg-red-700">
                          Add Address
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2 items-center">
                              <h3 className="font-medium">
                                {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                              </h3>
                              {address.isDefault && (
                                <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <Link href="/checkout">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                          </div>
                          <p className="text-sm">
                            {address.name}, {address.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.addressLine1}, 
                            {address.addressLine2 ? ` ${address.addressLine2},` : ''} 
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-gray-500 mt-2">
                      Saved payment methods will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
} 