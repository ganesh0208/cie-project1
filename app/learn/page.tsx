import { MainHeader } from "@/components/main-header"
import { CourseGrid } from "@/components/course-grid"
import { createClient } from "@/lib/supabase/server"

export default async function LearnPage() {
  const supabase = createClient()

  // Fetch languages and courses
  const { data: languages } = await supabase
    .from("languages")
    .select(`
      *,
      courses (
        id,
        title,
        description,
        difficulty_level,
        total_questions
      )
    `)
    .order("name")

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Learn Programming</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Choose from our comprehensive collection of programming languages. Each course includes detailed notes,
            examples, and hands-on coding challenges.
          </p>
        </div>

        <CourseGrid languages={languages || []} />
      </main>
    </div>
  )
}
