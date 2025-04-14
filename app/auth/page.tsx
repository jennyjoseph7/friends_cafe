"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle, Phone, User, KeyRound, Info, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "../../hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { hasUserSession } from "@/lib/session-storage"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/account'
  const { login, signup, isAuthenticated } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [loginOtpVerification, setLoginOtpVerification] = useState(false)
  const [hasExistingSession, setHasExistingSession] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("login")
  
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    otp: "",
    loginPhone: "",
    loginOtp: ""
  })
  
  // If user is already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, redirectPath, router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))

    // Check for existing session when phone number is entered
    if ((id === 'loginPhone' || id === 'phone') && value.length >= 10) {
      const normalizedPhone = value.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
      if (normalizedPhone.length >= 10) {
        const exists = hasUserSession(normalizedPhone)
        setHasExistingSession(exists ? normalizedPhone : null)
      } else {
        setHasExistingSession(null)
      }
    }
  }
  
  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation: must be at least 10 digits
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 10
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginOtpVerification) {
      // First phase: Validate phone and send OTP for login
      if (!validatePhoneNumber(formData.loginPhone)) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number",
          variant: "destructive"
        })
        return
      }
      
      // Check if this is a registered phone number
      const normalizedPhone = formData.loginPhone.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
      const exists = hasUserSession(normalizedPhone)
      
      if (!exists) {
        toast({
          title: "Account not found",
          description: "This phone number is not registered. Please sign up first.",
          variant: "destructive"
        })
        setActiveTab("signup")
        // Pre-fill the phone number in signup form
        setFormData(prev => ({
          ...prev,
          phone: formData.loginPhone
        }))
        return
      }
      
      setIsLoading(true)
      // Simulate OTP sending process
      setTimeout(() => {
        setIsLoading(false)
        setLoginOtpVerification(true)
        toast({
          title: "OTP Sent!",
          description: `An OTP has been sent to ${formData.loginPhone}`,
        })
      }, 1500)
    } else {
      // Second phase: Verify login OTP
      if (!formData.loginOtp || formData.loginOtp.length !== 4) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 4-digit OTP",
          variant: "destructive"
        })
        return
      }
      
      setIsLoading(true)
      
      const success = await login(formData.loginPhone, formData.loginOtp)
      if (success) {
        // Redirect to the specified path (cart or account)
        router.push(redirectPath)
      } else {
        setIsLoading(false)
      }
    }
  }
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!showOtpVerification) {
      // First phase: Validate inputs and send OTP
      if (!formData.username.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your name",
          variant: "destructive"
        })
        return
      }
      
      if (!validatePhoneNumber(formData.phone)) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number",
          variant: "destructive"
        })
        return
      }
      
      // Check if the user is already registered with this phone number
      const normalizedPhone = formData.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '')
      const userExists = hasUserSession(normalizedPhone)
      
      if (userExists) {
        toast({
          title: "Account already exists",
          description: "You're already a registered user. Kindly login.",
          variant: "destructive"
        })
        // Switch to login tab and pre-fill the phone number
        setActiveTab("login")
        setFormData(prev => ({
          ...prev,
          loginPhone: formData.phone
        }))
        return
      }
      
      setIsLoading(true)
      // Simulate OTP sending process
      setTimeout(() => {
        setIsLoading(false)
        setShowOtpVerification(true)
        toast({
          title: "OTP Sent!",
          description: `An OTP has been sent to ${formData.phone}`,
        })
      }, 1500)
    } else {
      // Second phase: Verify OTP and create account
      if (!formData.otp || formData.otp.length !== 4) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 4-digit OTP",
          variant: "destructive"
        })
        return
      }
      
      setIsLoading(true)
      
      const success = await signup(formData.username, formData.phone, formData.otp)
      if (success) {
        setSignupSuccess(true)
        
        // Redirect to specified redirect path after showing success for 2 seconds
        setTimeout(() => {
          router.push(redirectPath)
        }, 2000)
      } else {
        setIsLoading(false)
      }
    }
  }
  
  const handleResendOtp = (type: 'login' | 'signup') => {
    setIsLoading(true)
    // Simulate resending OTP
    const phoneNumber = type === 'login' ? formData.loginPhone : formData.phone
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "OTP Resent!",
        description: `A new OTP has been sent to ${phoneNumber}`,
      })
    }, 1000)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset forms when switching tabs
    setLoginOtpVerification(false)
    setShowOtpVerification(false)
  }
  
  if (signupSuccess) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center justify-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Account Created Successfully
                </CardTitle>
                <CardDescription className="text-center">
                  Your account has been created. You'll be redirected to your account dashboard in a moment.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="mb-4 text-green-600">Redirecting to your account...</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center text-red-600 mb-4">Account Access</h1>
          <p className="text-center text-gray-600 mb-8">
            Your cart items, addresses, and orders will be saved to your account
          </p>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    {loginOtpVerification ? <KeyRound className="mr-2 h-5 w-5 text-red-600" /> : <Phone className="mr-2 h-5 w-5 text-red-600" />}
                    {loginOtpVerification ? "Verify Your Phone" : "Welcome Back"}
                  </CardTitle>
                  <CardDescription>
                    {loginOtpVerification 
                      ? `Enter the OTP sent to ${formData.loginPhone}`
                      : "Enter your phone number to access your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {!loginOtpVerification ? (
                      <div className="space-y-2">
                        <Label htmlFor="loginPhone">Phone Number</Label>
                        <div className="relative">
                          <Input 
                            id="loginPhone" 
                            type="tel" 
                            placeholder="+91 98765 43210"
                            value={formData.loginPhone}
                            onChange={handleInputChange}
                            className="pl-8"
                            required
                          />
                          <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">
                          All your data is linked to your phone number
                        </p>
                        
                        {formData.loginPhone.length >= 10 && hasExistingSession === null && (
                          <Alert className="mt-3 bg-amber-50 text-amber-800 border border-amber-200">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="flex flex-col">
                              <span>This phone number is not registered. Please sign up first.</span>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="mt-2 bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800"
                                onClick={() => {
                                  setActiveTab("signup")
                                  setFormData(prev => ({
                                    ...prev,
                                    phone: formData.loginPhone
                                  }))
                                }}
                              >
                                Go to Sign Up
                              </Button>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="loginOtp">One-Time Password (OTP)</Label>
                        <Input 
                          id="loginOtp" 
                          placeholder="Enter 4-digit OTP"
                          value={formData.loginOtp}
                          onChange={handleInputChange}
                          className="text-center text-lg tracking-widest"
                          inputMode="numeric"
                          maxLength={4}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          For demo purposes, use "1234" as the OTP
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Didn't receive the code?{" "}
                          <button 
                            type="button" 
                            className="text-red-600 hover:underline"
                            onClick={() => handleResendOtp('login')}
                            disabled={isLoading}
                          >
                            Resend OTP
                          </button>
                        </p>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {loginOtpVerification ? "Verifying..." : "Sending OTP..."}
                        </span>
                      ) : (
                        loginOtpVerification ? "Verify & Login" : "Get OTP"
                      )}
                    </Button>
                    {loginOtpVerification && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setLoginOtpVerification(false)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="justify-center border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      className="text-red-600 hover:underline font-medium"
                      onClick={() => handleTabChange("signup")}
                    >
                      Sign up now
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    {showOtpVerification ? <KeyRound className="mr-2 h-5 w-5 text-red-600" /> : <User className="mr-2 h-5 w-5 text-red-600" />}
                    {showOtpVerification ? "Verify Your Phone" : "Create an Account"}
                  </CardTitle>
                  <CardDescription>
                    {showOtpVerification 
                      ? `Enter the OTP sent to ${formData.phone}`
                      : "Join Friends' Cafe with your phone number"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    {!showOtpVerification ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="username">Full Name</Label>
                          <div className="relative">
                            <Input 
                              id="username"
                              placeholder="John Doe"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="pl-8"
                              required
                            />
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Input 
                              id="phone"
                              type="tel"
                              placeholder="+91 98765 43210" 
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="pl-8"
                              required
                            />
                            <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500">
                            Your phone number will be used to sign in and recover your account
                          </p>
                          
                          {formData.phone.length >= 10 && hasExistingSession === formData.phone && (
                            <Alert className="mt-3 bg-amber-50 text-amber-800 border border-amber-200">
                              <Info className="h-4 w-4" />
                              <AlertDescription className="flex flex-col">
                                <span>You're already a registered user. Kindly login.</span>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-2 bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800"
                                  onClick={() => {
                                    setActiveTab("login")
                                    setFormData(prev => ({
                                      ...prev,
                                      loginPhone: formData.phone
                                    }))
                                  }}
                                >
                                  Go to Login
                                </Button>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password (OTP)</Label>
                        <Input 
                          id="otp"
                          placeholder="Enter 4-digit OTP" 
                          value={formData.otp}
                          onChange={handleInputChange}
                          className="text-center text-lg tracking-widest"
                          inputMode="numeric"
                          maxLength={4}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          For demo purposes, use "1234" as the OTP
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Didn't receive the code?{" "}
                          <button 
                            type="button"
                            className="text-red-600 hover:underline"
                            onClick={() => handleResendOtp('signup')}
                            disabled={isLoading}
                          >
                            Resend OTP
                          </button>
                        </p>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {showOtpVerification ? "Verifying..." : "Sending OTP..."}
                        </span>
                      ) : (
                        showOtpVerification ? "Create Account" : "Get OTP"
                      )}
                    </Button>
                    {showOtpVerification && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setShowOtpVerification(false)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="justify-center border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-red-600 hover:underline font-medium"
                      onClick={() => handleTabChange("login")}
                    >
                      Log in instead
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">
              By signing up or logging in, you agree to our Terms of Service and Privacy Policy.
              Your phone will be your primary identifier for account recovery and data persistence.
            </p>
            <Link href="/" className="text-sm text-red-600 hover:underline flex items-center justify-center">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 