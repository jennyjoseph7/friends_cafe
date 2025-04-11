import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MapPin, Clock, Send } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-12">Contact & Order</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-amber-700 mb-6">Get in Touch</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-700">+91 62396-53865</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="text-gray-700">Shop No.: 12, University View Estate Vill. Meheru, Phagwara</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Hours</h4>
                  <p className="text-gray-700">Monday - Sunday: 8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-semibold text-red-600 mb-2">Home Delivery Available!</h4>
              <p className="text-gray-700">We offer home delivery service. Call us to place your order now!</p>
              <p className="text-gray-700 mt-2">
                <strong>Note:</strong> Didn't Get Bill For Your Food? Have It For Free
              </p>
              <Button className="mt-4 bg-red-600 hover:bg-red-700">Call to Order</Button>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-amber-700 mb-6">Send us a Message</h3>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input id="name" placeholder="Your name" className="w-full" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email" className="w-full" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input id="phone" placeholder="Your phone number" className="w-full" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea id="message" placeholder="Your message" className="w-full min-h-[120px]" />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-amber-700 mb-6 text-center">Find Us</h3>
          <div className="h-[400px] w-full bg-gray-200 rounded-lg overflow-hidden">
            {/* Placeholder for map - in a real implementation, you would use Google Maps or similar */}
            <div className="h-full w-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-600">Map location would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
