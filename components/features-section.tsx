import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Users, Sparkles, Rocket, Heart } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing-fast performance that keeps up with your ambitions.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security ensures your data is always protected.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team, no matter where they are.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Intelligent automation that learns and adapts to your workflow.",
  },
  {
    icon: Rocket,
    title: "Scalable Growth",
    description: "Solutions that grow with your business, from startup to enterprise.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Designed with love, built for humans who value great experiences.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">Elevate</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make us different. Built for the modern world, designed for extraordinary
            results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover-lift group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
