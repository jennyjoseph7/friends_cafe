"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "../../../hooks/use-toast"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate request process
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password",
      })
    }, 1500)
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center text-red-600 mb-8">Reset Password</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Forgot your password?</CardTitle>
              <CardDescription>
                {!isSubmitted 
                  ? "Enter your email address and we'll send you a link to reset your password."
                  : "Password reset instructions have been sent to your email."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                </form>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-600 mb-4">
                    Please check your email and follow the instructions to reset your password.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Didn't receive an email? Check your spam folder or 
                    <button 
                      onClick={() => setIsSubmitted(false)} 
                      className="text-red-600 hover:underline ml-1"
                    >
                      try again
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 flex justify-center space-x-6">
            <Link href="/auth" className="inline-flex items-center text-red-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
            <Link href="/" className="text-red-600 hover:underline">
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 