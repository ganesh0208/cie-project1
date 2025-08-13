import { MainHeader } from "@/components/main-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, BookOpen, Trophy, Users, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Learn programming languages with hands-on tutorials and comprehensive notes.",
    },
    {
      icon: Code2,
      title: "Built-in Compiler",
      description: "Practice coding with our integrated compiler supporting multiple languages.",
    },
    {
      icon: Trophy,
      title: "Ranking System",
      description: "Track your progress and compete with other learners on the leaderboard.",
    },
    {
      icon: Target,
      title: "Progressive Challenges",
      description: "Start with basics and advance through increasingly difficult problems.",
    },
  ]

  const languages = [
    { name: "Python", color: "bg-blue-500", students: "50K+" },
    { name: "Java", color: "bg-orange-500", students: "45K+" },
    { name: "JavaScript", color: "bg-yellow-500", students: "60K+" },
    { name: "C++", color: "bg-purple-500", students: "35K+" },
    { name: "C", color: "bg-gray-600", students: "30K+" },
    { name: "HTML/CSS", color: "bg-red-500", students: "40K+" },
  ]

  return (
    <div className="min-h-screen">
      <MainHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Programming
              <span className="text-primary block">One Challenge at a Time</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn Python, Java, C++, JavaScript and more with interactive coding challenges, comprehensive tutorials,
              and a built-in compiler. Track your progress and climb the rankings!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/learn">Start Learning</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/compiler">Try Compiler</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Learn Coding</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and resources you need to become a proficient programmer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Programming Languages</h2>
            <p className="text-xl text-muted-foreground">
              Choose from our comprehensive collection of programming languages
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {languages.map((language, index) => (
              <Card key={index} className="hover-lift cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${language.color}`} />
                      <span className="font-semibold">{language.name}</span>
                    </div>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {language.students}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link href="/learn">Explore All Languages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100K+</div>
              <div className="text-lg text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Coding Challenges</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">7</div>
              <div className="text-lg text-muted-foreground">Programming Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of learners and start mastering programming today.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/sign-up">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
