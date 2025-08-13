import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Elevate Your{" "}
              <span className="text-blue-600 relative">
                Experience
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-sky-400 rounded-full"></div>
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-lg">
              Innovative solutions designed with you in mind. Transform the way you work, create, and connect with
              cutting-edge technology.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white hover-lift group">
                Discover More
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:border-blue-600 hover:text-blue-600 hover-lift group bg-transparent"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-sky-500 rounded-3xl shadow-2xl hover-lift">
              <img
                src="/placeholder-kwkhv.png"
                alt="Modern dashboard interface"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-sky-400 rounded-2xl shadow-lg animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-600 rounded-xl shadow-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
