import Image from "next/image"

export function About() {
  return (
    <section id="about" className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">About Friends Cafe</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Friends Cafe, where good food meets great company. Our cafe has become a beloved gathering spot
              for friends and families looking for delicious food in a warm, welcoming atmosphere.
            </p>
            <p className="text-gray-700 mb-4">
              At Friends Cafe, we believe in serving fresh, delicious food made with love and care. Our menu offers a
              wide variety of dishes, from traditional Indian favorites to international cuisines, ensuring there's
              something for everyone.
            </p>
            <p className="text-gray-700">
              Whether you're stopping by for a quick breakfast, a leisurely lunch, or a cozy dinner, our friendly staff
              is dedicated to making your dining experience memorable. Come join us and feel the warmth of friendship in
              every bite!
            </p>
          </div>
          <div className="md:w-1/2 relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?height=800&width=1200&text=Friends+Cafe+Interior"
              alt="Friends Cafe Interior"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
