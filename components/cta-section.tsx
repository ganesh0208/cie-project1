import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Ready to <span className="text-blue-600">Elevate</span> Your Journey?
        </h2>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their workflow. Start your free trial today and
          experience the difference.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white hover-lift group">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 hover:border-blue-600 hover:text-blue-600 hover-lift bg-transparent"
          >
            Schedule Demo
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
      </div>
    </section>
  )
}
