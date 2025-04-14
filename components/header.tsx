"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ShoppingCartIcon, MenuIcon, XIcon, UserIcon, LogOutIcon, User2Icon, ShoppingBagIcon, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../hooks/use-cart"
import { useAuth } from "../hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  
  // Check if the user is on the account page (simulates being logged in)
  const isLoggedIn = pathname?.startsWith('/account')

  // Handle logout
  const handleLogout = () => {
    logout()
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return 'U';
    return user.username.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex-1">
          <h1 className="text-2xl font-bold text-red-600">Friends&apos; Cafe</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks isLoggedIn={isAuthenticated} />
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full h-8 pr-3 pl-2 border-none">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-red-100 text-red-600 text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.username}
                    <div className="text-xs text-muted-foreground font-normal">{user?.phone}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User2Icon className="h-4 w-4 mr-2" />
                      Account Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="icon" asChild className="relative">
                <Link href="/auth">
                  <UserIcon className="h-5 w-5" />
                </Link>
              </Button>
            )}
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
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-red-100 text-red-600 text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.username}
                  <div className="text-xs text-muted-foreground font-normal">{user?.phone}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User2Icon className="h-4 w-4 mr-2" />
                    Account Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders" className="cursor-pointer">
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    Order History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="icon" asChild className="relative">
              <Link href="/auth">
                <UserIcon className="h-5 w-5" />
              </Link>
            </Button>
          )}
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
            <NavLinks mobile onClick={() => setIsMenuOpen(false)} isLoggedIn={isAuthenticated} />
            {isAuthenticated && (
              <>
                <Link
                  href="/account/orders"
                  className="flex items-center text-left font-medium py-2 text-gray-700 hover:text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBagIcon className="h-4 w-4 mr-2" />
                  Order History
                </Link>
                <button 
                  className="flex items-center text-left font-medium py-2 text-red-600 hover:text-red-800"
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              </>
            )}
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
              ? "flex items-center py-2 text-gray-700 hover:text-red-600"
              : "text-gray-700 hover:text-red-600"
          }`}
          onClick={onClick}
        >
          {mobile && <HomeIcon className="h-4 w-4 mr-2" />}
          Dashboard
        </Link>
      )}
    </>
  )
}
