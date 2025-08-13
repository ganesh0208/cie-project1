import { redirect } from "next/navigation"

export default function CoursesPage() {
  // Redirect to learn page for consistency
  redirect("/learn")
}
