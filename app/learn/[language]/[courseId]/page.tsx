import { MainHeader } from "@/components/main-header"
import { CourseNotes } from "@/components/course-notes"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code2 } from "lucide-react"
import Link from "next/link"

interface CoursePageProps {
  params: {
    language: string
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createClient()

  // Fetch course details with notes
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
      languages (name),
      course_notes (
        id,
        title,
        content,
        order_index
      )
    `)
    .eq("id", params.courseId)
    .single()

  if (!course) {
    notFound()
  }

  // Sort notes by order_index
  const sortedNotes = course.course_notes?.sort((a: any, b: any) => a.order_index - b.order_index) || []

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto py-8 px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/learn">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">
                {course.languages.name} • {course.description}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/learn/${params.language}/${params.courseId}/practice`}>
              <Code2 className="h-4 w-4 mr-2" />
              Start Practice
            </Link>
          </Button>
        </div>

        {/* Course Notes */}
        <CourseNotes notes={sortedNotes} />
      </main>
    </div>
  )
}
