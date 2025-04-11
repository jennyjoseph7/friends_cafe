"use client"

import { useState } from "react"
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

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876 543 210",
  address: "123 Street Name, City, State 400001",
  orders: [
    { id: "ORD-1234", date: "2023-07-15", status: "Delivered", total: 420 },
    { id: "ORD-1235", date: "2023-07-22", status: "Delivered", total: 350 },
    { id: "ORD-1236", date: "2023-07-30", status: "Processing", total: 580 },
  ]
}

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate update process
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      })
    }, 1500)
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData.name} />
              <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-red-600">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{userData.address}</span>
              </div>
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
                          defaultValue={userData.name}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email" 
                          defaultValue={userData.email}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          type="tel" 
                          defaultValue={userData.phone}
                          required
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        type="password" 
                        placeholder="Enter current password to confirm changes"
                      />
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
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <Input 
                            id="oldPassword"
                            type="password" 
                            required
                          />
                        </div>
                        <div className="space-y-2"></div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input 
                            id="newPassword"
                            type="password" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword"
                            type="password" 
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-red-600 mb-4">Account Management</h3>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out from all devices
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Delete account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userData.orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div>
                            <span 
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex-1 md:text-right">
                            <p className="font-medium">₹{order.total.toFixed(2)}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 relative">
                      <Badge className="absolute top-2 right-2 bg-green-600">Default</Badge>
                      <h3 className="font-medium mb-2">Home</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        John Doe<br />
                        123 Street Name, Apartment 456<br />
                        Mumbai, Maharashtra 400001<br />
                        Phone: +91 9876 543 210
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Office</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        John Doe<br />
                        456 Office Building, 7th Floor<br />
                        Mumbai, Maharashtra 400002<br />
                        Phone: +91 9876 543 210
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
                        <Button variant="outline" size="sm">Set as Default</Button>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <Button variant="outline" className="mb-2">
                        <MapPin className="mr-2 h-4 w-4" />
                        Add New Address
                      </Button>
                      <p className="text-gray-500 text-sm">
                        Add a new delivery address to make checkout faster
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Saved Payment Methods</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 relative">
                          <Badge className="absolute top-2 right-2 bg-green-600">Default</Badge>
                          <div className="flex items-center">
                            <CreditCard className="h-8 w-8 mr-3 text-blue-600" />
                            <div>
                              <h4 className="font-medium">VISA ending in 4242</h4>
                              <p className="text-sm text-gray-500">Expires 08/2025</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                          <Button variant="outline" className="mb-2">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Add New Payment Method
                          </Button>
                          <p className="text-gray-500 text-sm">
                            Add a new card or payment method
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Payment Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <input 
                            type="checkbox" 
                            id="saveCardDetails" 
                            className="mt-1 mr-2" 
                            defaultChecked 
                          />
                          <div>
                            <Label htmlFor="saveCardDetails" className="font-medium">
                              Save card details for future payments
                            </Label>
                            <p className="text-sm text-gray-500">
                              Your payment information will be stored securely for future orders
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <input 
                            type="checkbox" 
                            id="defaultPayment" 
                            className="mt-1 mr-2" 
                            defaultChecked 
                          />
                          <div>
                            <Label htmlFor="defaultPayment" className="font-medium">
                              Use most recent payment method by default
                            </Label>
                            <p className="text-sm text-gray-500">
                              We'll automatically select your most recent payment method during checkout
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center text-red-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 