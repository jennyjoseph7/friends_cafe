"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter();
  
  return (
    <section id="home" className="relative h-[80vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          filter: "brightness(0.7)",
        }}
      />
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Welcome to Friends Cafe</h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
          Delicious food, friendly atmosphere, and unforgettable moments
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Menu
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-red-600"
            onClick={() => router.push('/cart')}
          >
            Order Now
          </Button>
        </div>
      </div>
    </section>
  )
}
