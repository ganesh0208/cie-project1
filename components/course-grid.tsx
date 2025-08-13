"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Code2, Target, Users, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Course {
  id: number
  title: string
  description: string
  difficulty_level: string
  total_questions: number
}

interface Language {
  id: number
  name: string
  description: string
  courses: Course[]
}

interface CourseGridProps {
  languages: Language[]
}

export function CourseGrid({ languages }: CourseGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [userProgress, setUserProgress] = useState<Record<number, number>>({})
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProgress = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: progress } = await supabase
          .from("user_progress")
          .select("question_id, questions(course_id)")
          .eq("user_id", user.id)
          .eq("is_solved", true)

        if (progress) {
          const courseProgress: Record<number, number> = {}
          progress.forEach((p: any) => {
            const courseId = p.questions.course_id
            courseProgress[courseId] = (courseProgress[courseId] || 0) + 1
          })
          setUserProgress(courseProgress)
        }
      }
    }

    fetchUserProgress()
  }, [supabase])

  const filteredLanguages = languages
    .filter((language) => {
      const matchesSearch =
        language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        language.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        language.courses.some(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )

      const hasMatchingCourses =
        difficultyFilter === "all" || language.courses.some((course) => course.difficulty_level === difficultyFilter)

      return matchesSearch && hasMatchingCourses
    })
    .map((language) => ({
      ...language,
      courses: language.courses.filter(
        (course) => difficultyFilter === "all" || course.difficulty_level === difficultyFilter,
      ),
    }))

  const getLanguageIcon = (name: string) => {
    const icons: Record<string, string> = {
      Python: "🐍",
      Java: "☕",
      "C++": "⚡",
      C: "🔧",
      JavaScript: "🟨",
      HTML: "🌐",
      CSS: "🎨",
    }
    return icons[name] || "💻"
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getProgressPercentage = (courseId: number, totalQuestions: number) => {
    const solved = userProgress[courseId] || 0
    return totalQuestions > 0 ? Math.round((solved / totalQuestions) * 100) : 0
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search languages and courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredLanguages.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredLanguages.map((language) => (
            <div key={language.id} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getLanguageIcon(language.name)}</div>
                <div>
                  <h2 className="text-3xl font-bold">{language.name}</h2>
                  <p className="text-muted-foreground">{language.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {language.courses.map((course) => {
                  const progressPercentage = getProgressPercentage(course.id, course.total_questions)

                  return (
                    <Card key={course.id} className="hover-lift">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <Badge
                            variant="secondary"
                            className={`${getDifficultyColor(course.difficulty_level)} text-white`}
                          >
                            {course.difficulty_level}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {progressPercentage > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{course.total_questions} challenges</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>Active</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button asChild className="flex-1">
                            <Link href={`/learn/${language.name.toLowerCase()}/${course.id}`}>
                              <BookOpen className="h-4 w-4 mr-2" />
                              Study Notes
                            </Link>
                          </Button>
                          <Button variant="outline" asChild className="flex-1 bg-transparent">
                            <Link href={`/learn/${language.name.toLowerCase()}/${course.id}/practice`}>
                              <Code2 className="h-4 w-4 mr-2" />
                              Practice
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
