"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function TestRedirectPage() {
  const router = useRouter()
  
  const handleRedirect = () => {
    console.log("Redirecting to order success page...")
    router.push("/order/success?method=cod")
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Redirect</h1>
      <p className="mb-4">This page tests the redirect to the order success page.</p>
      <Button onClick={handleRedirect}>
        Test Redirect to Order Success
      </Button>
    </div>
  )
} 