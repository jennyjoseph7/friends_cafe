import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-4">Friends' Cafe</h3>
            <p className="text-gray-600 mb-4">
              Serving delicious food since 2015. We take pride in using fresh ingredients 
              and creating memorable dining experiences.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-gray-500 hover:text-red-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" className="text-gray-500 hover:text-red-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-gray-500 hover:text-red-600">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#menu" className="text-gray-600 hover:text-red-600">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-600 hover:text-red-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-600 hover:text-red-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 hover:text-red-600">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-600 hover:text-red-600">
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">
                  Shop No 12, University View Estate Village,<br />
                  Meheru, Phagwara
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <a href="tel:+916239653865" className="text-gray-600 hover:text-red-600">
                  +91 62396-53865
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <a href="mailto:info@friendscafe.com" className="text-gray-600 hover:text-red-600">
                  info@friendscafe.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {currentYear} Friends' Cafe. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="hover:text-red-600">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-red-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
