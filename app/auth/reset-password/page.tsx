"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "../../../hooks/use-toast"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate request process
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccessful(true)
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      })
    }, 1500)
  }
  
  // If no token provided, show error
  if (!token) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center text-red-600 mb-8">Invalid Reset Link</h1>
            
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-red-600">Link Invalid or Expired</CardTitle>
                <CardDescription>
                  The password reset link you clicked is invalid or has expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="text-gray-600 mb-6">
                  Please request a new password reset link.
                </p>
                <Link href="/auth/forgot-password">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Request New Link
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <Link href="/auth" className="inline-flex items-center text-red-600 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
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
          <h1 className="text-3xl font-bold text-center text-red-600 mb-8">Reset Your Password</h1>
          
          {isSuccessful ? (
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Password Reset Successfully
                </CardTitle>
                <CardDescription>
                  Your password has been updated. You can now log in with your new password.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <Link href="/auth">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Go to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Create New Password</CardTitle>
                <CardDescription>
                  Enter your new password below. Choose a strong password for better security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters and include a mix of letters, numbers and symbols.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating Password..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          {!isSuccessful && (
            <div className="mt-8 text-center">
              <Link href="/auth" className="inline-flex items-center text-red-600 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 