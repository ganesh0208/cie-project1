import { MainHeader } from "@/components/main-header"
import { UserProfile } from "@/components/user-profile"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile and progress
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  // Fetch user's recent activity
  const { data: recentActivity } = await supabase
    .from("user_progress")
    .select(`
      *,
      questions (
        title,
        difficulty_level,
        points,
        courses (
          title,
          languages (name)
        )
      )
    `)
    .eq("user_id", user.id)
    .eq("is_solved", true)
    .order("solved_at", { ascending: false })
    .limit(10)

  // Get user's rank
  const { data: rankData } = await supabase.rpc("get_user_rank", {
    user_rating: profile?.rating || 0,
  })

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto py-8 px-4">
        <UserProfile profile={profile} recentActivity={recentActivity || []} userRank={rankData || 0} />
      </main>
    </div>
  )
}
