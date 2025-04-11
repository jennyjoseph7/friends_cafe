import { Menu } from "@/components/menu"
import { Contact } from "@/components/contact"
import { About } from "@/components/about"
import { Hero } from "@/components/hero"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50">
      <Header />
      <Hero />
      <Menu />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
