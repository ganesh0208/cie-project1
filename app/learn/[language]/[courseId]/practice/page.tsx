import { MainHeader } from "@/components/main-header"
import { QuestionsList } from "@/components/questions-list"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"

interface PracticePageProps {
  params: {
    language: string
    courseId: string
  }
}

export default async function PracticePage({ params }: PracticePageProps) {
  const supabase = createClient()

  // Fetch course details with questions
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
      languages (name),
      questions (
        id,
        title,
        problem_statement,
        sample_input,
        expected_output,
        difficulty_level,
        points,
        order_index
      )
    `)
    .eq("id", params.courseId)
    .single()

  if (!course) {
    notFound()
  }

  // Sort questions by order_index
  const sortedQuestions = course.questions?.sort((a: any, b: any) => a.order_index - b.order_index) || []

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto py-8 px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/learn/${params.language}/${params.courseId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{course.title} - Practice</h1>
              <p className="text-muted-foreground">
                {course.languages.name} • {sortedQuestions.length} challenges
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/learn/${params.language}/${params.courseId}`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Study Notes
            </Link>
          </Button>
        </div>

        {/* Questions List */}
        <QuestionsList questions={sortedQuestions} courseId={params.courseId} language={params.language} />
      </main>
    </div>
  )
}
