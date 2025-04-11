"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ShoppingCartIcon, MenuIcon, XIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../hooks/use-cart"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const pathname = usePathname()
  
  // Check if the user is on the account page (simulates being logged in)
  const isLoggedIn = pathname?.startsWith('/account')

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex-1">
          <h1 className="text-2xl font-bold text-red-600">Friends&apos; Cafe</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks isLoggedIn={isLoggedIn} />
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon" asChild className="relative">
              <Link href={isLoggedIn ? "/account" : "/auth"}>
                <UserIcon className="h-5 w-5" />
                {isLoggedIn && (
                  <Badge className="absolute -top-2 -right-2 w-2 h-2 p-0 bg-green-600" />
                )}
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-red-600" 
                    variant="destructive"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center space-x-4">
          <Button variant="outline" size="icon" asChild className="relative">
            <Link href={isLoggedIn ? "/account" : "/auth"}>
              <UserIcon className="h-5 w-5" />
              {isLoggedIn && (
                <Badge className="absolute -top-2 -right-2 w-2 h-2 p-0 bg-green-600" />
              )}
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCartIcon className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-red-600" 
                  variant="destructive"
                >
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden py-4 px-4 bg-gray-50 border-t">
          <div className="flex flex-col space-y-4">
            <NavLinks mobile onClick={() => setIsMenuOpen(false)} isLoggedIn={isLoggedIn} />
          </div>
        </nav>
      )}
    </header>
  )
}

function NavLinks({ mobile, onClick, isLoggedIn }: { mobile?: boolean; onClick?: () => void; isLoggedIn?: boolean }) {
  const links = [
    { href: "/#about", label: "About" },
    { href: "/#menu", label: "Menu" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#contact", label: "Contact" },
  ]

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`font-medium ${
            mobile
              ? "block py-2 text-gray-700 hover:text-red-600"
              : "text-gray-700 hover:text-red-600"
          }`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
      {isLoggedIn && (
        <Link
          href="/account"
          className={`font-medium ${
            mobile
              ? "block py-2 text-gray-700 hover:text-red-600"
              : "text-gray-700 hover:text-red-600"
          }`}
          onClick={onClick}
        >
          My Account
        </Link>
      )}
    </>
  )
}
