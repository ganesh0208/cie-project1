import { MainHeader } from "@/components/main-header"
import { CompilerInterface } from "@/components/compiler-interface"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface CompilerPageProps {
  searchParams: {
    question?: string
    course?: string
    lang?: string
  }
}

export default async function CompilerPage({ searchParams }: CompilerPageProps) {
  const supabase = createClient()

  // If no question specified, show general compiler
  if (!searchParams.question) {
    return (
      <div className="min-h-screen">
        <MainHeader />
        <main className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Code Compiler</h1>
          <CompilerInterface />
        </main>
      </div>
    )
  }

  // Fetch question details
  const { data: question } = await supabase
    .from("questions")
    .select(`
      *,
      courses (
        id,
        title,
        languages (name)
      )
    `)
    .eq("id", searchParams.question)
    .single()

  if (!question) {
    redirect("/learn")
  }

  // Get user authentication status
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user progress for this question
  let userProgress = null
  if (user) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", question.id)
      .single()

    userProgress = progress
  }

  // Get next question in the course
  const { data: nextQuestion } = await supabase
    .from("questions")
    .select("id, order_index")
    .eq("course_id", question.course_id)
    .gt("order_index", question.order_index)
    .order("order_index")
    .limit(1)
    .single()

  return (
    <div className="min-h-screen">
      <MainHeader />
      <CompilerInterface
        question={question}
        userProgress={userProgress}
        nextQuestion={nextQuestion}
        courseId={searchParams.course}
        language={searchParams.lang}
      />
    </div>
  )
}
